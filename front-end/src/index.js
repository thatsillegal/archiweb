/* eslint-disable no-unused-vars,no-case-declarations */
"use strict";
import * as ARCH from "@/archiweb"
import socket from "@/socket";
import * as THREE from "three";
import {DragControls} from "three/examples/jsm/controls/DragControls";
import {create} from "@/piechart"

let renderer, scene, drag;
let gf, am, mt;

let camera, light;
let environment;

let buildings = [], block, handles=[];
let EDITMODE = false, IMAGEMODE = false;

let blockID = 1936;

//1936


function clear(list) {
  if(list !== undefined)
    list.forEach((e)=>{
      e.parent.remove(e)
    });
  list = [];
}


function initWS() {
  socket.on('resultBlock', async function(data){
    window.Result.blocks = [];
    
    for (let e of data) {
      console.log(e);
      window.Result.blocks.push(e);
    }
    
    
  })
  
  socket.on('stb:loadFromDatabase', async function (geometryElements) {
    clear(handles);
    clear(buildings);
    environment.clear();
    console.log('loading')
    
    for(let e of geometryElements) {
      let points = gf.coordinatesToPoints(e.coordinates, e.size);
      if(e.closed) points.pop();
  
      let handle = [];
      
      if( e.properties.type === 'block' ) {
        points.forEach((p)=>{
          handle.push(gf.Cylinder([p.x, p.y, p.z], [1, 10], mt.Matte(0xB68D70), false));
        });
        am.addSelection(handle, 1);
        handles.push(handle);
        console.log(e);
        window.piedata = []
        for (let key in e.properties['F_Diversity'] ) {
          // e.properties[key];
          console.log(key, e.properties['F_Diversity'][key]);
          window.piedata.push({label: key, val:e.properties['F_Diversity'][key]});
        }
        window.SideBar.items[1].hint = '' + e.properties['A'].toFixed(2) + 'm2';
        window.SideBar.items[2].hint = '' + e.properties['GSI'].toFixed(2);
        window.SideBar.items[3].hint = '' + (e.properties['T_dense']/Math.sqrt(e.properties['A'])).toFixed(4);
        
        create();
      }

      if(e.properties.type === 'building') {
        points.forEach((p)=>{
          handle.push(gf.Cylinder([p.x, p.y, p.z], [1, 10], mt.Matte(0xB68D70), false));
        });
        am.addSelection(handle, 1);
        handles.push(handle);
        
        let building = gf.Segments(points, e.closed, 0, true);
        building.material = mt.Doubled(0);
        ARCH.setPolygonOffsetMaterial(building.material);
        building.position.z = 5;
        building.children[1].material.color = new THREE.Color('#FFF')
        buildings.push(building);
        building.properties = e.properties;
        handle.object = building;

      } else if (e.properties.type === 'block') {
        
        block = gf.Segments(points, e.closed, 0xffffff, true);
        block.material = mt.Doubled(0xffffff);
        block.position.z = 0;
        block.properties = e.properties;
        ARCH.setPolygonOffsetMaterial(block.material);
        handle.object = block;

      } else if (e.properties.type === 'road'){
        let road = gf.Segments(points, e.closed);
        road.position.z = -2;
        environment.add(road);
      } else{
        let building = gf.Segments(points, e.closed, 0x444444, true);
        building.material = mt.Doubled(0x666666);
        ARCH.setPolygonOffsetMaterial(building.material);
        building.position.z = -5;
        environment.add(building);
      }
    }
  
    initDrag();
  
    toggleImageMode(true);
    sendImage();
    toggleImageMode(false);
    toggleEditMode(EDITMODE);
    am.refreshSelection(scene);
    am.setCurrentID(1);
  });
}

function initScene() {
  scene.background = new THREE.Color('#cccccc');
  handles = []
  buildings = [];
  
  gf = new ARCH.GeometryFactory(scene);
  mt = new ARCH.MaterialFactory();
  light = new THREE.AmbientLight( 0xffffff ); // soft white light
  scene.add( light );
  environment = new THREE.Group();
  scene.add(environment);
  // socket.emit('bts:initFromDatabase', {properties: {id: 3488 }})
  socket.emit('bts:initFromDatabase', {properties: {id:blockID}})

  
}

function initDrag() {
  
  drag = new DragControls(handles.flat(), camera, renderer.domElement);

  drag.addEventListener('drag', function (event) {
    handles.forEach((handle) => {
      if(handle.includes(event.object)) {
        let z;
        if(handle.object.properties.type === 'building') z = 5;
        else if(handle.object.properties.type === 'block') z = 0;
        handle.object.setFromPoints((handle.map((h) => new THREE.Vector3(h.position.x, h.position.y, z))));
      }
    })
  
  })
}

function addKeyEvent() {
  renderer.domElement.addEventListener('keydown', onDocumentKeyDown, false);
  
  function onDocumentKeyDown(event) {
    if(event.altKey || event.ctrlKey || event.shiftKey) return;
    console.log(event);
    switch (event.keyCode) {
      case 69: // e
        if(IMAGEMODE) toggleImageMode(false)
        EDITMODE = !EDITMODE;
        toggleEditMode(EDITMODE);
        break;
      case 82: // r
        if(EDITMODE) toggleEditMode(false);
        IMAGEMODE = !IMAGEMODE;
        toggleImageMode(IMAGEMODE);
        break;
      case 83: // s
        if(IMAGEMODE) {
          sendImage();
        }
          // window.saveAsImage(renderer);
        
    }
  }
}

function sendImage() {
  let size = new THREE.Vector2();
  renderer.getSize(size);
  let w = size.x;
  let h = size.y;
  
  let renderin = new THREE.WebGLRenderer({antialias: true, alpha: true, preserveDrawingBuffer: true});
  renderin.autoClear = false;
  renderin.setPixelRatio(window.devicePixelRatio);
  renderin.setSize(w, h)
  const rt = new THREE.WebGLRenderTarget(w, h);
  console.log(renderer)
  // renderin.render(scene, camera);
  // renderin.setRenderTarget(rt);
  renderin.render(scene, camera, rt);
  
  const buffer = new Uint8Array(w * h * 4);
  renderin.readRenderTargetPixels(rt, 0, 0, w, h, buffer);
  let res = new Array(w * h);
  for(let i = 0; i < w * h; ++ i) {
    res[i] = buffer[4*i];
  }
  
  socket.emit('server:extractor', {'image': res})
  
}

function toggleImageMode(mode) {
  IMAGEMODE = mode;
  handles.forEach((handle)=>{
    handle.forEach((h)=>{
      h.visible = false;
    })
  })
  environment.visible = !mode;
  block.children[1].visible = mode;
  drag.deactivate();
  
  if(mode) {
    scene.background = new THREE.Color('#ffffff');
  } else {
    scene.background = new THREE.Color('#cccccc');
  }
}

function toggleEditMode(mode) {
  EDITMODE = mode;
  handles.forEach((handle)=>{
    handle.forEach((h)=>{
      h.visible = mode;
    })
  })
  
  environment.visible = !mode;
  block.children[1].visible = mode;
  if(mode) {
    drag.activate();
  } else {
    drag.deactivate();
  }
}

function main() {
  const size = document.getElementById('container').clientWidth;
  
  const viewport = new ARCH.Viewport(size, size);
  renderer = viewport.renderer;
  scene = viewport.scene;
  viewport.controller.enabled = false;
  
  camera = viewport.to2D();
  camera.zoom = 3;
  camera.updateProjectionMatrix();
  
  am = viewport.enableAssetManager();
  viewport.disableGUI();
  
  initWS();
  initScene();
  addKeyEvent();
}

export {
  main
}

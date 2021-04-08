/* eslint-disable no-unused-vars,no-case-declarations */
"use strict";
import * as ARCH from "@/archiweb"
import socket from "@/socket";
import * as THREE from "three";
import {DragControls} from "three/examples/jsm/controls/DragControls";

let renderer, scene, drag;
let gf, am, mt;

let camera, light;
let environment;

let buildings = [], block, handles=[];
let EDITMODE = false, IMAGEMODE = false;


function clear(list) {
  if(list !== undefined)
    list.forEach((e)=>{
      e.parent.remove(e)
    });
  list = [];
}


function initWS() {
  socket.on('stb:loadFromDatabase', async function (geometryElements) {
    clear(handles);
    clear(buildings);
    environment.clear();
    console.log('loading')
    
    for(let e of geometryElements) {
      let points = gf.coordinatesToPoints(e.coordinates, e.size);
      if(e.closed) points.pop();
  
      let handle = [];
      if(e.properties.type === 'building' || e.properties.type === 'block') {
        points.forEach((p)=>{
          handle.push(gf.Cylinder([p.x, p.y, p.z], [1, 10], mt.Matte(0xB68D70), false));
        });
        am.addSelection(handle, 1);
        handles.push(handle);
      }
      
      if(e.properties.type === 'building') {
        let building = gf.Segments(points, e.closed, 0, true);
        building.material = mt.Doubled(0);
        ARCH.setPolygonOffsetMaterial(building.material);
        building.position.z = 5;
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
  socket.emit('bts:initFromDatabase', {properties: {id:10}})
  
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
          let size = new THREE.Vector2();
          renderer.getSize(size);
          let w = size.x;
          let h = size.y;
          const rt = new THREE.WebGLRenderTarget(w, h);
          renderer.render(scene, camera, rt);

          const buffer = new Uint8Array(w * h * 4);
          renderer.readRenderTargetPixels(rt, 0, 0, w, h, buffer);
          let res = new Uint8Array(w * h);
          for(let i = 0; i < w * h; ++ i) {
            res[i] = buffer[4*i];
          }
          console.log(res);
          
        }
          // window.saveAsImage(renderer);
        
    }
  }
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

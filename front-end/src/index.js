/* eslint-disable no-unused-vars,no-case-declarations */
"use strict";
import * as THREE from 'three'
import * as ARCH from "@/archiweb"

let renderer, scene, gui;

let camera;
const xoy = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const raycaster = new THREE.Raycaster();
let mouse;

let gf, am, tr, mt;

const param = {
  color: 0xdddddd
}

function initGUI() {
  gui.gui.addColor(param, 'color').listen().onChange(() => {
    if (currentObj)
      currentObj.material.color = new THREE.Color(param.color);
    
  });
}

function initScene() {
  scene.background = new THREE.Color(0xfafafa);
  
  
  gf = new ARCH.GeometryFactory(scene);
  mt = new ARCH.MaterialFactory();
  
  const b1 = gf.Cuboid([150, 150, 0], [300, 300, 300], mt.Matte());
  
  const b2 = gf.Cuboid([-300, -300, 0], [300, 300, 100], mt.Matte());
  
  const b3 = gf.Cuboid([300, -500, 0], [300, 300, 150], mt.Matte());
  
  
  am.refreshSelection(scene);
  am.addSelection([b1, b2, b3], 1);
  am.setCurrentID(1);
  
}

let currentObj = undefined;


function objectChanged(o) {
  currentObj = o;
  am.highlightCurrent();
  if (o) {
    param.color = o.material.color.getHex();
  }
}

function updateObject(uuid, model) {
  const o = scene.getObjectByProperty('uuid', uuid);
  o.updateModel(o, model);
}

function addMouseEvent() {
  renderer.domElement.addEventListener('mousemove', onMove, false);
  
  function onMove(event) {
    // console.log(event)
    mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    )
  }
}

function addBox() {
  raycaster.setFromCamera(mouse, camera);
  let p = raycaster.ray.intersectPlane(xoy, new THREE.Vector3());
  let h = Math.round(Math.random() * 1000);
  let b = gf.Cuboid([p.x, p.y, p.z], [300, 300, h], mt.Matte())
  am.addSelection([b], 1);
  am.refreshSelection(scene);
}


function addKeyEvent() {
  renderer.domElement.addEventListener('keydown', onDocumentKeyDown, false);
  renderer.domElement.addEventListener('keyup', onDocumentKeyUp, false);
  
  function onDocumentKeyDown(event) {
    switch (event.keyCode) {
      case 65:
        addBox();
        console.log('a down')
      
    }
  }
  
  function onDocumentKeyUp(event) {
    switch (event.keyCode) {
      // case 16: // Shift
      //   controller.enablePan = false;
      //   break;
      case 65:
        
        console.log('a up')
      
      
    }
  }
}


function main() {
  const viewport = new ARCH.Viewport();
  scene = viewport.scene;
  renderer = viewport.renderer;
  gui = viewport.gui;
  camera = viewport.camera;
  
  // viewport.draw = draw;
  
  am = viewport.enableAssetManager();
  viewport.enableDragFrames();
  tr = viewport.enableTransformer();
  tr.objectChanged = objectChanged;
  
  initScene();
  
  const sceneBasic = new ARCH.SceneBasic(scene, renderer);
  sceneBasic.addGUI(gui.gui);
  sceneBasic.floorColor = '#ffffff';
  sceneBasic.floor.material.color.set(sceneBasic.floorColor);
  initGUI();
  addKeyEvent();
  addMouseEvent();
}

export {
  main,
  updateObject
}

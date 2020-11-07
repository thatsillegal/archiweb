/* eslint-disable no-unused-vars,no-case-declarations */
"use strict";

import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {TransformControls} from "three/examples/jsm/controls/TransformControls";

import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial';
import {Wireframe} from "three/examples/jsm/lines/Wireframe";
import {WireframeGeometry2} from "three/examples/jsm/lines/WireframeGeometry2";

import {DragFrames} from "@/viewers/DragFrames";
import {SceneBasic} from "@/viewers/SceneBasic";
import {Transformer} from "@/viewers/Transformer";

const gui = require('@/viewers/3D/gui')

let renderer, scene;
let orbit;
let cameraPersp, cameraOrtho, currentCamera;
let sceneBasic, dragFrames, transformer;

let scene2D, camera2D;

const objects = [];
let selected = [];

let grouped;

function initRender() {
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = false;
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  addToDOM();
}

function initCamera(width, height) {
  initPerspectiveCamera(width, height);
  initOrthographicCamera(width, height);
  initCamera2D(width, height);
  
  currentCamera = cameraPersp;
}

function initOrthographicCamera(width, height) {
  let aspect = width / height;
  cameraOrtho = new THREE.OrthographicCamera(-600 * aspect, 600 * aspect, 600, -600, 0.01, 30000);
  cameraOrtho.position.set(1000,-1500,1000);
  cameraOrtho.up = new THREE.Vector3(0,0,1);
}

function initPerspectiveCamera(width, height) {
  cameraPersp = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  cameraPersp.position.set(1000, -1500, 1000);
  cameraPersp.up = new THREE.Vector3(0, 0, 1);
}

function initCamera2D(width, height) {
  
  scene2D = new THREE.Scene();
  
  camera2D = new THREE.OrthographicCamera(-width / 2, width / 2, -height / 2, height / 2, 1, 10);
  camera2D.position.x = width / 2 - 8;
  camera2D.position.y = height / 2;
  camera2D.position.z = 10;
}

function meshLine(geometry, color, linewidth) {
  const matLine = new LineMaterial({color: color, linewidth: linewidth});
  const geoLine = new WireframeGeometry2(geometry);
  const wireframe = new Wireframe(geoLine, matLine);
  wireframe.computeLineDistances();
  wireframe.scale.set(1, 1, 1);
  return wireframe;
}

function initScene() {
  sceneBasic = new THREE.Scene();
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfafafa);
  
  const box = new THREE.BoxBufferGeometry(300, 300, 300);
  // box.scale(0.001, 0.001, 0.001);
  
  
  const b1 = new THREE.Mesh(box, new THREE.MeshLambertMaterial({color: 0xdddddd}));
  b1.add(meshLine(box, 0xffff00, 0.005));
  b1.children[0].visible = false;
  
  b1.castShadow = true;
  b1.receiveShadow = true;
  b1.position.set(150, 150, 150);
  objects.push(b1);
  scene.add(b1);
  
  
  const b2 = new THREE.Mesh(box, new THREE.MeshLambertMaterial({color: 0xdddddd}));
  b2.add(meshLine(box, 0xffff00, 0.005));
  b2.children[0].visible = false;
  
  b2.castShadow = true;
  b2.receiveShadow = true;
  b2.scale.set(1, 1, 1.0 / 3);
  b2.position.set(-300, -300, 50);
  objects.push(b2);
  scene.add(b2);
  
  const b3 = new THREE.Mesh(box, new THREE.MeshLambertMaterial({color: 0xdddddd}));
  b3.add(meshLine(box, 0xffff00, 0.005));
  b3.children[0].visible = false;
  
  b3.castShadow = true;
  b3.receiveShadow = true;
  b3.scale.set(1, 1, 1.0 / 2);
  b3.position.set(300, -500, 75);
  objects.push(b3);
  scene.add(b3) ;
  
  grouped = new THREE.Group();
  scene.add(grouped);
  
  
}

function attachObject(objs) {
  if(objs.length === 1) {
    transformer.control.attach(objs[0]);
    dragFrames.enabled = false;
  } else if (objs.length > 1) {
    
    for(let i = 0; i < objs.length; ++ i) {
      grouped.add(objs[i]);
    }
    transformer.control.attach(grouped);
    dragFrames.enabled = false;
  }
}

function initDragFrames() {
  
  dragFrames = new DragFrames(objects, currentCamera, scene, scene2D, renderer);
  
  dragFrames.enabled = true;
  
  dragFrames.addEventListener('selectdown', function(event) {
    console.log("event len" + event.object.length);
    for (let i = 0; i < event.object.length; ++ i) {
      scene.attach(event.object[i]);
    }
    console.log("cur group" + grouped.children.length);
  });
  
  dragFrames.addEventListener('select', function (event) {
    for (let i = 0; i < event.object.length; ++i) {
      event.object[i].material.emissive.set(0x666600);
      if (event.object[i].children.length > 0)
        event.object[i].children[0].visible = true;
    }
    selected = event.object;
  });
  
  dragFrames.addEventListener('selectup', function (event) {
    for (let i = 0; i < event.object.length; ++i) {
      event.object[i].material.emissive.set(0x000000);
      if (event.object[i].children.length > 0)
        event.object[i].children[0].visible = false;
    }
    selected = event.object;
  });
}


function initControls() {
  
  orbit = new OrbitControls(currentCamera, renderer.domElement);
  orbit.enablePan = false;
  
  orbit.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    RIGHT: THREE.MOUSE.ROTATE
  }
  
  

  
}

function windowResize(w, h) {
  cameraPersp.aspect = w / h;
  cameraPersp.updateProjectionMatrix();
  
  camera2D.left = -w / 2;
  camera2D.right = w / 2;
  camera2D.top = -h / 2;
  camera2D.bottom = h / 2;
  camera2D.position.x = w / 2 - 8;
  camera2D.position.y = h / 2;
  camera2D.updateProjectionMatrix();
  
  cameraOrtho.left = cameraOrtho.bottom * w / h;
  cameraOrtho.right = cameraOrtho.top * w / h;
  cameraOrtho.updateProjectionMatrix();
  
  renderer.setSize(w, h);
  
  render();
}


function render() {
  renderer.clear();
  renderer.render(scene, currentCamera);
  renderer.clearDepth();
  renderer.render(scene2D, camera2D);
}


function animate() {
  
  orbit.update();
  render();

  requestAnimationFrame(animate);
}


function onDocumentKeyDown(event) {
  switch (event.keyCode) {
    case 16: // Shift
      orbit.enablePan = true;
      break;
    case 67: // C
      const position = currentCamera.position.clone();
    
      currentCamera = currentCamera.isPerspectiveCamera ? cameraOrtho : cameraPersp;
      currentCamera.position.copy(position);
    
      orbit.object = currentCamera;
      transformer.control.camera = currentCamera;
    
      currentCamera.lookAt(orbit.target.x, orbit.target.y, orbit.target.z);
      windowResize(window.innerWidth, window.innerHeight);
      break;
    case 86: // V
      const randomFoV = Math.random() + 0.1;
      const randomZoom = Math.random() + 0.1;
    
      cameraPersp.fov = randomFoV * 160;
      cameraOrtho.bottom = -randomFoV * 500;
      cameraOrtho.top = randomFoV * 500;
    
      cameraPersp.zoom = randomZoom * 5;
      cameraOrtho.zoom = randomZoom * 5;
      windowResize(window.innerWidth, window.innerHeight);
      break;
  
  }
  
}

function onDocumentKeyUp(event) {
  switch (event.keyCode) {
    
    case 16: // Shift
      orbit.enablePan = false;
      break;
    
  }
  
}




function onClick(event) {
    
    //TODO
  if(transformer.dragged) {
    transformer.dragged = !transformer.dragged;
    return;
  }
  
  const mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera( mouse, currentCamera );
  
  const intersections = raycaster.intersectObjects( objects, true );
  
  console.log("inter " + intersections.length);
  console.log("selec " + selected.length);
  

  
  if(selected.length > 0) {
     attachObject(selected);
     selected = [];
  } else if ( intersections.length > 0 ) {
    attachObject([intersections[0].object]);
  } else {
    
    transformer.control.detach();
    dragFrames.enabled = true;
  }
}


function addToDOM() {
  const container = document.getElementById('container');
  const canvas = container.getElementsByTagName('canvas');
  if (canvas.length > 0) {
    container.removeChild(canvas[0]);
  }
  container.appendChild(renderer.domElement);
  
  window.onresize = function () {
    windowResize(window.innerWidth, window.innerHeight);
  };
  renderer.domElement.addEventListener('keydown', onDocumentKeyDown, false);
  renderer.domElement.addEventListener('keyup', onDocumentKeyUp, false);
  renderer.domElement.addEventListener('click', onClick, false);
  
}

function init() {
  initRender();
  initScene();
  initCamera(window.innerWidth, window.innerHeight);
  initControls();
  
  gui.initGUI();
  initDragFrames();
  
  transformer = new Transformer(scene,orbit, renderer, currentCamera);
  
  sceneBasic = new SceneBasic(scene, renderer, transformer.control);
  sceneBasic.addGUI(gui.gui);
  
}

function main() {
  init();
  animate();
}

export {
  main,
}

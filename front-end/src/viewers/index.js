/* eslint-disable no-unused-vars */
"use strict";

import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {DragControls} from "three/examples/jsm/controls/DragControls";
import {FlyControls} from "three/examples/jsm/controls/FlyControls";
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import {Wireframe} from "three/examples/jsm/lines/Wireframe";
import {WireframeGeometry2} from "three/examples/jsm/lines/WireframeGeometry2";

import {DragFrames} from "@/viewers/DragFrames";
import {SceneBasic} from "@/viewers/SceneBasic";

const gui = require('@/viewers/gui')

let renderer, camera, scene, light;
let controls, dragControls, dragFrames;
let sceneBasic;

let sceneOtho, cameraOtho;

let width = window.innerWidth;
let height = window.innerHeight;

const objects = [];

let grouped;


function initRender() {
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = false;
  renderer.setSize(width, height);
  

  addToDOM();
}

function initOrthoScene() {
  sceneOtho = new THREE.Scene();
}

function initPerspectiveCamera() {
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  camera.position.set(1000, -1500, 1000);
  camera.up = new THREE.Vector3(0, 0, 1);
}

function initOrthoCamera() {
  cameraOtho = new THREE.OrthographicCamera(-width / 2, width / 2, -height / 2, height / 2, 1, 10);
  cameraOtho.position.x = width / 2 - 8;
  cameraOtho.position.y = height / 2;
  cameraOtho.position.z = 10;
}

function meshLine(geometry, color, linewidth) {
  const matLine = new LineMaterial( {color: color, linewidth: linewidth} );
  const geoLine = new WireframeGeometry2(geometry);
  const wireframe = new Wireframe( geoLine, matLine );
  wireframe.computeLineDistances();
  wireframe.scale.set( 1, 1, 1 );
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
  b1.position.set(150, 150, 150);
  objects.push(b1);
  scene.add(b1);
  
  
  const b2 = new THREE.Mesh(box, new THREE.MeshLambertMaterial({color: 0xdddddd}));
  b2.add(meshLine(box, 0xffff00, 0.005));
  b2.children[0].visible = false;

  b2.castShadow = true;
  b2.scale.set(1, 1, 1.0 / 3);
  b2.position.set(-300, -300, 50);
  objects.push(b2);
  scene.add(b2);

  grouped = new THREE.Group();
  scene.add(grouped);
  
}

function initLight() {
  scene.add(new THREE.AmbientLight(0x404040));
  
  light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, -20, 15);
  scene.add(light);
}

function controlsUpdate(method) {
  if (method === 'Mouse') {
    console.log('now Mouse')
    
    
    initPerspectiveCamera();
    initMouseControls();
    initDragControls();
  }
  if (method === 'WASD') {
    console.log('now WASD')
    
    
    initPerspectiveCamera();
    initWASDControls();
    
  }
  
}

function initDragFrames() {
  
  dragFrames = new DragFrames(objects, camera, scene, sceneOtho, renderer);
  
  dragFrames.enabled = false;
  
  dragFrames.addEventListener('selectdown', function(event) {
    for(let i = 0; i < event.object.length; ++ i) {
      console.log(event.object[i]);
      event.object[i].material.emissive.set(0x666600);
      if(event.object[i].children.length > 0)
        event.object[i].children[0].visible = true;
      // event.object[i].material.wireframe = true;
    }
  });
  
  dragFrames.addEventListener('selectup', function (event){
    console.log("out");
    for(let i = 0; i < event.object.length; ++ i) {
      event.object[i].material.emissive.set(0x000000);
      // event.object[i].material.wireframe = false;
      if(event.object[i].children.length > 0)
        event.object[i].children[0].visible = false;
    }
  });
}

function initDragControls() {
  dragControls = new DragControls(objects, camera, renderer.domElement);
  
  let posZ = 0;
  dragControls.addEventListener('dragstart', function (event) {
    
    console.log(event);
    event.object.material.emissive.set(0xaaaaaa);
    posZ = event.object.position.z;
    
  });
  
  dragControls.addEventListener('drag', function (event) {
    event.object.position.z = posZ;
  });
  dragControls.addEventListener('dragend', function (event) {
    
    event.object.material.emissive.set(0x000000);
    // event.object.position.z = 0;
    
  });
  dragControls.enabled = false;
}

function initMouseControls() {
  
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    RIGHT: THREE.MOUSE.ROTATE
  }
  
  
}

function initWASDControls() {
  controls = new FlyControls(camera, renderer.domElement);
  
  controls.movementSpeed = 1000;
  controls.domElement = renderer.domElement;
  controls.rollSpeed = Math.PI / 24;
  controls.autoForward = true;
  controls.dragToLook = true;
  
}

function render() {
  renderer.clear();
  renderer.render(scene, camera);
  renderer.clearDepth();
  renderer.render(sceneOtho, cameraOtho);
}

function windowResize(w, h) {
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  
  cameraOtho.left = -w / 2;
  cameraOtho.right = w / 2;
  cameraOtho.top = -h / 2;
  cameraOtho.bottom = h / 2;
  cameraOtho.position.x = w / 2 - 8;
  cameraOtho.position.y = h / 2;
  cameraOtho.updateProjectionMatrix();
  
  renderer.setSize(w, h);
}


function animate() {
  
  controls.update();
  render();
  
  requestAnimationFrame(animate);
}


function onDocumentKeyDown(event) {
  let {which: keyCode} = event;
  console.log(keyCode + 'down')
  if (keyCode === 16) {
    controls.enableRotate = false;
    controls.enablePan = true;
    controls.update();
  }
  if (keyCode === 17) {
    controls.enabled = false;
    dragFrames.enabled = true;
  }
  if (keyCode === 18) {
    controls.enabled = false;
    dragControls.enabled = true;
  }
  
}

function onDocumentKeyUp(event) {
  let {which: keyCode} = event;
  console.log(keyCode + 'up')
  if (keyCode === 16) {
    controls.enableRotate = true;
    controls.enablePan = false;
    controls.update();
  }
  if (keyCode === 17) {
    dragFrames.unSelected();
    dragFrames.enabled = false;
    controls.enabled = true;
  }
  if (keyCode === 18) {
    dragControls.enabled = false;
    controls.enabled = true;
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
  
}

function init() {
  initRender();
  initScene();
  initOrthoScene();
  initOrthoCamera();
  initLight();
  gui.initGUI();
  // initPerspectiveCamera();
  // initWASDControls();
  // initMouseControls();
  controlsUpdate(gui.controls.control);
  //
  initDragFrames();
  sceneBasic = new SceneBasic(scene, renderer);
  sceneBasic.addGUI(gui.gui);

  console.log(sceneBasic.floor.material)
  
  animate();
}

function main() {
  init();
}

export {
  main,
  windowResize,
  controlsUpdate,
}

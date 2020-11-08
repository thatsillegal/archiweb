/* eslint-disable no-unused-vars,no-case-declarations */
"use strict";

import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

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


const objects = [];

function initRender() {
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.autoClear = false;
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  addToDOM();
}

function initCamera(width, height) {
  initPerspectiveCamera(width, height);
  initOrthographicCamera(width, height);
  
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


function meshLine(geometry, color, linewidth) {
  const matLine = new LineMaterial({color: color, linewidth: linewidth});
  const geoLine = new WireframeGeometry2(geometry);
  const wireframe = new Wireframe(geoLine, matLine);
  wireframe.computeLineDistances();
  wireframe.scale.set(1, 1, 1);
  return wireframe;
}

function initScene() {
  
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
  
  
  sceneBasic = new SceneBasic(scene, renderer);
  sceneBasic.addGUI(gui.gui);
}


function initDragFrames() {
  
  dragFrames = new DragFrames(objects, currentCamera, scene, renderer);
  dragFrames.enabled = true;
  
  dragFrames.addEventListener('selectdown', function(event) {
    transformer.clear();
  });
  
  dragFrames.addEventListener('select', function (event) {
    for (let i = 0; i < event.object.length; ++i) {
      event.object[i].material.emissive.set(0x666600);
      if (event.object[i].children.length > 0)
        event.object[i].children[0].visible = true;
    }
  });
  
  dragFrames.addEventListener('selectup', function (event) {
    for (let i = 0; i < event.object.length; ++i) {
      event.object[i].material.emissive.set(0x000000);
      if (event.object[i].children.length > 0)
        event.object[i].children[0].visible = false;
    }
    transformer.setSelected(event.object);
  });
}


function initControls() {
  
  orbit = new OrbitControls(currentCamera, renderer.domElement);
  orbit.enablePan = false;
  
  orbit.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    RIGHT: THREE.MOUSE.ROTATE
  }
  
  initDragFrames();
  
  transformer = new Transformer(scene, renderer, currentCamera, objects, dragFrames);
  transformer.addGUI(gui.gui);
  
  
}

function windowResize(w, h) {
  
  cameraPersp.aspect = w / h;
  cameraPersp.updateProjectionMatrix();
  

  cameraOrtho.left = cameraOrtho.bottom * w / h;
  cameraOrtho.right = cameraOrtho.top * w / h;
  cameraOrtho.updateProjectionMatrix();
  
  dragFrames.onWindowResize(w, h);
  
  renderer.setSize(w, h);
  
  render();
}


function render() {
  renderer.clear();
  renderer.render(scene, currentCamera);
  
  if (dragFrames !== undefined)
    dragFrames.render();
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
      transformer.setCamera(currentCamera);
    
      break;
    case 86: // V
      const randomFoV = Math.random() + 0.1;
      const randomZoom = Math.random() + 0.1;
    
      cameraPersp.fov = randomFoV * 160;
      cameraOrtho.bottom = -randomFoV * 500;
      cameraOrtho.top = randomFoV * 500;
    
      cameraPersp.zoom = randomZoom * 5;
      cameraOrtho.zoom = randomZoom * 5;
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
  
  gui.initGUI();
  
  initRender();
  initScene();
  initCamera(window.innerWidth, window.innerHeight);
  initControls();
  
  
}

function main() {
  init();
  animate();
}

export {
  main,
}

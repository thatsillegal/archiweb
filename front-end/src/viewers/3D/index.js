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
import {MultiCamera} from "@/viewers/MultiCamera";

const gui = require('@/viewers/3D/gui')

let renderer, scene;
let orbit;
let sceneBasic, dragFrames, transformer;
let multiCamera;


const objects = [];

function initRender() {
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.autoClear = false;
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  addToDOM();
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
  const edges = new THREE.EdgesGeometry(box);
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0x000000}));
  // box.scale(0.001, 0.001, 0.001);
  
  
  const b1 = new THREE.Mesh(box, new THREE.MeshLambertMaterial({color: 0xdddddd}));
  b1.add(meshLine(box, 0xffff00, 0.005));
  b1.add(line);
  b1.children[0].visible = false;
  
  b1.castShadow = true;
  b1.receiveShadow = true;
  b1.position.set(150, 150, 150);
  objects.push(b1);
  scene.add(b1);
  
  
  const b2 = new THREE.Mesh(box, new THREE.MeshLambertMaterial({color: 0xdddddd}));
  b2.add(meshLine(box, 0xffff00, 0.005));
  b2.add(line.clone());
  b2.children[0].visible = false;
  
  b2.castShadow = true;
  b2.receiveShadow = true;
  b2.scale.set(1, 1, 1.0 / 3);
  b2.position.set(-300, -300, 50);
  objects.push(b2);
  scene.add(b2);
  
  const b3 = new THREE.Mesh(box, new THREE.MeshLambertMaterial({color: 0xdddddd}));
  b3.add(meshLine(box, 0xffff00, 0.005));
  b3.add(line.clone());
  b3.children[0].visible = false;
  
  b3.castShadow = true;
  b3.receiveShadow = true;
  b3.scale.set(1, 1, 1.0 / 2);
  b3.position.set(300, -500, 75);
  objects.push(b3);
  scene.add(b3);
  
  
  sceneBasic = new SceneBasic(scene, renderer);
  sceneBasic.addGUI(gui.gui);
}


function initDragFrames() {
  
  dragFrames = new DragFrames(objects, multiCamera.camera, scene, renderer);
  dragFrames.enabled = true;
  
  dragFrames.addEventListener('selectdown', function (event) {
    transformer.clear();
  });
  
  dragFrames.addEventListener('select', function (event) {
    for (let i = 0; i < event.object.length; ++i) {
      event.object[i].material.emissive.set(0x666600);
      if (event.object[i].children.length > 0) {
        event.object[i].children[0].visible = true;
        event.object[i].children[1].visible = false;
      }
    }
  });
  
  dragFrames.addEventListener('selectup', function (event) {
    for (let i = 0; i < event.object.length; ++i) {
      event.object[i].material.emissive.set(0x000000);
      if (event.object[i].children.length > 0) {
        event.object[i].children[0].visible = false;
        event.object[i].children[1].visible = true;
      }
    }
    transformer.setSelected(event.object);
  });
}


function initControls() {
  
  orbit = new OrbitControls(multiCamera.camera, renderer.domElement);
  orbit.enablePan = false;
  
  orbit.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    RIGHT: THREE.MOUSE.ROTATE
  }
  multiCamera.addControllers(orbit);
  
  initDragFrames();
  
  transformer = new Transformer(scene, renderer, multiCamera.camera, objects, dragFrames);
  transformer.addGUI(gui.gui);
  
  multiCamera.addControllers(transformer);
  
}

function windowResize(w, h) {
  
  multiCamera.onWindowResize(w, h);
  dragFrames.onWindowResize(w, h);
  
  renderer.setSize(w, h);
  
  render();
}


function render() {
  
  // console.log(multiCamera.camera);
  renderer.clear();
  renderer.render(scene, multiCamera.camera);

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
  
  multiCamera = new MultiCamera(scene, renderer);
  multiCamera.addGUI(gui.gui);
  initControls();
  
  
}

function main() {
  init();
  animate();
}

export {
  main,
}

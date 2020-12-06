// /* eslint-disable no-unused-vars,no-case-declarations */
"use strict";
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

/**
 *      ___           ___           ___           ___                       ___           ___           ___
 *     /\  \         /\  \         /\  \         /\__\          ___        /\__\         /\  \         /\  \
 *    /::\  \       /::\  \       /::\  \       /:/  /         /\  \      /:/ _/_       /::\  \       /::\  \
 *   /:/\:\  \     /:/\:\  \     /:/\:\  \     /:/__/          \:\  \    /:/ /\__\     /:/\:\  \     /:/\:\  \
 *  /::\~\:\  \   /::\~\:\  \   /:/  \:\  \   /::\  \ ___      /::\__\  /:/ /:/ _/_   /::\~\:\  \   /::\~\:\__\
 * /:/\:\ \:\__\ /:/\:\ \:\__\ /:/__/ \:\__\ /:/\:\  /\__\  __/:/\/__/ /:/_/:/ /\__\ /:/\:\ \:\__\ /:/\:\ \:|__|
 * \/__\:\/:/  / \/_|::\/:/  / \:\  \  \/__/ \/__\:\/:/  / /\/:/  /    \:\/:/ /:/  / \:\~\:\ \/__/ \:\~\:\/:/  /
 *      \::/  /     |:|::/  /   \:\  \            \::/  /  \::/__/      \::/_/:/  /   \:\ \:\__\    \:\ \::/  /
 *      /:/  /      |:|\/__/     \:\  \           /:/  /    \:\__\       \:\/:/  /     \:\ \/__/     \:\/:/  /
 *     /:/  /       |:|  |        \:\__\         /:/  /      \/__/        \::/  /       \:\__\        \::/__/
 *     \/__/         \|__|         \/__/         \/__/                     \/__/         \/__/         ~~
 *
 *
 *
 * Copyright (c) 2020-present, Inst.AAA.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Date: 2020-11-12
 * Author: Yichen Mo
 */

import SceneBasic from "@/viewers/SceneBasic";
import MultiCamera from "@/viewers/MultiCamera";

import GeometryFactory from "@/creator/GeometryFactory";
import {setPolygonOffsetMaterial, setMaterial, setMaterialOpacity} from "@/creator/MaterialFactory";
import Loader from "@/creator/Loader";

import * as gui from '@/gui'

let renderer, scene;
let orbit;
let gb;
let sceneBasic, loader;
let multiCamera;



function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfafafa);
  

  
  gb = new GeometryFactory(scene);
  
  gb.Box([150, 150, 0], [300, 300, 300], new THREE.MeshLambertMaterial({color: 0xdddddd}));
  
  gb.Box([-300, -300, 0], [300, 300, 100], new THREE.MeshLambertMaterial({color: 0xdddddd}));
  
  gb.Box([300, -500, 0], [300, 300, 150], new THREE.MeshLambertMaterial({color: 0xdddddd}));
  
  gb.Cylinder([-300, 0, 0], [50, 300, 4], new THREE.MeshLambertMaterial({color: 0xdddddd}), true);
  
  loader = new Loader(scene);
  loader.addGUI(gui.util);
  
  loader.loadModel('http://model.amomorning.com/tree/spruce-tree.dae', (mesh) => {
    mesh.position.set(0, -300, 0);
  
    setMaterial(mesh, new THREE.MeshLambertMaterial({color: 0x99A083, transparent: true, opacity: 0.8}))
    setPolygonOffsetMaterial(mesh.material);
    mesh.toCamera = true;
    
  });
  
  loader.loadModel('http://model.amomorning.com/tree/autumn-tree.dae', (mesh) => {
    mesh.position.set(500, 0, 0);
    mesh.scale.set(2, 2, 2);
    setMaterialOpacity(mesh, 0.6);
    setPolygonOffsetMaterial(mesh.material);
    mesh.toCamera = true;
  });
  
  
}



function initControls() {
  orbit = new OrbitControls(multiCamera.camera, renderer.domElement);
  
  orbit.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    RIGHT: THREE.MOUSE.ROTATE
  }
  orbit.enablePan = false;
  
  multiCamera.addControllers(orbit);
}

function windowResize(w, h) {
  
  multiCamera.onWindowResize(w, h);
  renderer.setSize(w, h);
  
  render();
}

function render() {
  
  scene.traverse((obj) => {
    if (obj.toCamera) {
      let v = new THREE.Vector3().subVectors(multiCamera.camera.position, obj.position);
      let theta = -Math.atan2(v.x, v.y);
      
      obj.quaternion.set(0, 0, 0, 1);
      obj.rotateZ(theta);
    }
  });
  
  renderer.clear();
  renderer.render(scene, multiCamera.camera);
  
}


function animate() {
  /* ---------- orbit must update if you want to change view of multiCamera ---------- */
  orbit.update();
  
  requestAnimationFrame(animate);
  render();
}

function initRender() {
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  addToDOM();
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


// EventListeners

function onDocumentKeyDown(event) {
  switch (event.keyCode) {
    case 16: // Shift
      orbit.enablePan = true;
      
      break;
    case 73:
      window.InfoCard.hideInfoCard(!window.InfoCard.show);
    
  }
}

function onDocumentKeyUp(event) {
  switch (event.keyCode) {
    
    case 16: // Shift
      orbit.enablePan = false;
      break;
  }
  
}


// APIs

function updateObject(uuid, position, model) {
  const o = scene.getObjectByProperty('uuid', uuid);
  // o.position.copy(position);
  gb.updateModel(o, model);
}

function init() {

  initScene();
  
  renderer.autoClear = false;
  multiCamera = new MultiCamera(scene, renderer);
  multiCamera.addGUI(gui.gui);
  
  initControls();
  
  sceneBasic = new SceneBasic(scene, renderer);
  sceneBasic.addGUI(gui.gui);
  
}


function main() {
  window.objects = [];
  gui.initGUI();
  
  initRender();
  init();
  animate();
}

export {
  main,
  updateObject,
  
}

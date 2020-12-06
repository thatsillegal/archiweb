/* eslint-disable no-unused-vars,no-case-declarations */
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
import DragFrames from "@/editor/DragFrames";
import Transformer from "@/editor/Transformer";

import SceneBasic from "@/viewers/SceneBasic";
import MultiCamera from "@/viewers/MultiCamera";

import GeometryFactory from "@/creator/GeometryFactory";
import {setMaterial, setMaterialOpacity} from "@/creator/MaterialFactory";
import Loader from "@/creator/Loader";
import AssetManager from "@/creator/AssetManager";

import * as gui from '@/gui'

let renderer, scene;
let orbit;
let gb;
let sceneBasic, transformer, loader, assetManager;
let multiCamera;
let archijson, dragFrames;
let camera, drag;

window.objects = [];


function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfafafa);
  
  assetManager = new AssetManager(scene);
  assetManager.addGUI(gui.util);
  
  gb = new GeometryFactory(scene);
  
  const b1 = gb.Box([150, 150, 0], [300, 300, 300], new THREE.MeshLambertMaterial({color: 0xdddddd}));
  
  const b2 = gb.Box([-300, -300, 0], [300, 300, 100], new THREE.MeshLambertMaterial({color: 0xdddddd}));
  
  const b3 = gb.Box([300, -500, 0], [300, 300, 150], new THREE.MeshLambertMaterial({color: 0xdddddd}));
  
  const b4 = gb.Cylinder([-300, 0, 0], [50, 300, 4], new THREE.MeshLambertMaterial({color: 0xdddddd}), true);
  
  loader = new Loader(scene);
  loader.addGUI(gui.util);
  
  loader.loadModel('http://model.amomorning.com/tree/spruce-tree.dae', (mesh) => {
    mesh.position.set(0, -300, 0);
    setMaterial(mesh, new THREE.MeshLambertMaterial({color: 0x99A083, transparent: true, opacity: 0.8}))
    mesh.toCamera = true;
    assetManager.refreshSelection();
  });
  
  loader.loadModel('http://model.amomorning.com/tree/autumn-tree.dae', (mesh) => {
    mesh.position.set(500, 0, 0);
    mesh.scale.set(2, 2, 2);
    setMaterialOpacity(mesh, 0.6);
    mesh.toCamera = true;
    assetManager.refreshSelection();
  });
  
  
  assetManager.refreshSelection();
  assetManager.addSelection([b1, b2, b3, b4], 1);
}


function initDrag() {
  dragFrames = new DragFrames(renderer, scene, multiCamera.camera);
  dragFrames.enabled = true;
  
  dragFrames.addEventListener('selectdown', () => {
    transformer.clear()
  });
  dragFrames.addEventListener('select', onSelectDown);
  dragFrames.addEventListener('selectup', onSelectUp);
}


function initControls() {
  if (orbit !== undefined) orbit.dispose();
  orbit = new OrbitControls(camera, renderer.domElement);
  initDrag();
  
  orbit.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    RIGHT: THREE.MOUSE.ROTATE
  }
  orbit.enablePan = false;
  transformer = new Transformer(scene, renderer, camera, drag);
  
  transformer.addGUI(gui.gui);
  
  
}

function windowResize(w, h) {
  
  multiCamera.onWindowResize(w, h);
  dragFrames.onWindowResize(w, h);
  
  renderer.setSize(w, h);
  
  render();
}

function render() {
  
  scene.traverse((obj) => {
    if (obj.toCamera) {
      let v = new THREE.Vector3().subVectors(camera.position, obj.position);
      let theta = -Math.atan2(v.x, v.y);
      
      obj.quaternion.set(0, 0, 0, 1);
      obj.rotateZ(theta);
    }
  });
  
  renderer.clear();
  renderer.render(scene, camera);
  dragFrames.render();
  
}


function animate() {
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

function onSelectDown(event) {
  window.highlighted = true;
  assetManager.highlightList(event.object);
}

function onSelectUp(event) {
  window.highlighted = false;
  assetManager.unHighlightList(event.object);
  transformer.setSelected(event.object);
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
  multiCamera = new MultiCamera(renderer.domElement);
  multiCamera.addGUI(gui.gui);
  
  camera = multiCamera.camera;
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

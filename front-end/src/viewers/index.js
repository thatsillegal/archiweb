/* eslint-disable no-unused-vars,no-case-declarations */
"use strict";
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {DragControls} from "three/examples/jsm/controls/DragControls";


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
 */
import {DragFrames} from "@/viewers/DragFrames";
import {SceneBasic} from "@/viewers/SceneBasic";
import {Transformer} from "@/viewers/Transformer";
import {MultiCamera} from "@/viewers/MultiCamera";
import {GeometryFactory} from "@/viewers/GeometryFactory";
import {Loader} from "@/viewers/Loader";
import {AssetManager} from "@/viewers/AssetManager";
import {ArchiJSON} from "./ArchiJSON";

const gui = require('@/viewers/gui')

let renderer, scene;
let orbit;
let gb;
let sceneBasic, transformer, loader, assetManager;
let multiCamera;
let archijson;
let camera, drag;
let InfoCard;

window.objects = [];
// let objects = window.objects;
let D3 = true;

let pos=[[-10, 30], [0, 10], [30, -10], [40, -30], [50, -50]];



function initScene2D() {
  scene = new THREE.Scene();
  
  gb = new GeometryFactory(scene);
  let controls = {
    color: 0xfafafa
  };
  scene.background = new THREE.Color(controls.color);
  
  gui.gui.addColor(controls, 'color').onChange(function() {
    scene.background = new THREE.Color(controls.color);
  });
  
  renderer.autoClear = true;
  
  const light = new THREE.SpotLight( 0xffffff, 1.5 );
  light.position.set(0,0,1000);
  scene.add(light);
  
  for(let p of pos) {
    gb.Cylinder(p, [1, 1], new THREE.MeshLambertMaterial({color:0xff0000}));
  }
  
  gb.Curve(window.objects);
  
}


function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfafafa);
  
  assetManager = new AssetManager(scene);
  assetManager.addGUI(gui.util);
  
  gb = new GeometryFactory(scene);

  const b1 = gb.Box([150, 150, 0], [300, 300, 300], new THREE.MeshLambertMaterial( { color : 0xdddddd } ));
  
  const b2 = gb.Box([-300, -300, 0], [300, 300, 100], new THREE.MeshLambertMaterial( { color : 0xdddddd } ));
  
  const b3 = gb.Box([300, -500, 0], [300, 300, 150], new THREE.MeshLambertMaterial( { color : 0xdddddd } ));
  
  const b4 = gb.Cylinder([-300, 0, 0], [50, 300, 4], new THREE.MeshLambertMaterial( { color : 0xdddddd } ), true);
  
  loader = new Loader(scene);
  loader.addGUI(gui.util);
  
  loader.loadModel('/models/spruce-tree.dae', (mesh) => {
    mesh.position.set(0, -300, 0);
    gb.setMeshMaterial(mesh, new THREE.MeshLambertMaterial({color: 0x99A083, transparent:true, opacity:0.8}) )
    mesh.toCamera = true;
    assetManager.refreshSelection();
  });

  loader.loadModel('/models/autumn-tree.dae', (mesh) => {
    mesh.position.set(500, 0, 0);
    mesh.scale.set(2, 2, 2);
    gb.setMaterialOpacity(mesh, 0.6);
    mesh.toCamera = true;
    assetManager.refreshSelection();
  });
  

  assetManager.refreshSelection();
  assetManager.addSelection([b1, b2, b3, b4], 1);
}





function initDrag() {
  if(D3) {
    drag = new DragFrames(camera, scene, renderer);
    drag.enabled = true;
  
    drag.addEventListener('selectdown',()=>{ transformer.clear() });
    drag.addEventListener('select', onSelectDown);
    drag.addEventListener('selectup', onSelectUp);
    
  } else {
    drag = new DragControls(window.objects, camera, renderer.domElement);
    drag.addEventListener( 'hoveron', function (event) {
      
      
      
      let o = event.object;
      o.toInfoCard();
      orbit.enabled = false;
    } );
    drag.addEventListener( 'hoveroff', function () {
      orbit.enabled = true;
    } );
    drag.addEventListener('dragend', function(event) {
      
      let o = event.object;
      o.toInfoCard();
      gb.Curve(window.objects);
    });
    drag.addEventListener('drag', function() {
      gb.Curve(window.objects);
    })
  }
}


function initControls() {
  if(orbit !== undefined) orbit.dispose();
  orbit = new OrbitControls(camera, renderer.domElement);
  initDrag();
  
  if(D3) {
    orbit.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      RIGHT: THREE.MOUSE.ROTATE
    }
    orbit.enablePan = false;
    multiCamera.addControllers(orbit);
    transformer = new Transformer(scene, renderer, camera, drag);
    
    transformer.addGUI(gui.gui);
    
    multiCamera.addControllers(transformer);
    assetManager.setTransformerObject(transformer.object);
  } else {

    orbit.enableRotate = false;

  }
  
}

function windowResize(w, h) {
  
  if(D3) {
    multiCamera.onWindowResize(w, h);
    drag.onWindowResize(w, h);
  } else {
    camera.left = camera.bottom * w/h;
    camera.right = camera.top * w/h;
    camera.updateProjectionMatrix();
  }
  renderer.setSize(w, h);
  
  render();
}

function render() {
  
  scene.traverse((obj) => {
    if(obj.toCamera) {
      let v = new THREE.Vector3().subVectors(camera.position, obj.position);
      let theta = -Math.atan2(v.x, v.y);
      
      obj.quaternion.set(0, 0, 0, 1);
      obj.rotateZ(theta);
    }
  });
  
  if(D3) {
    renderer.clear();
    renderer.render(scene, camera);
    drag.render();
  } else {
    renderer.render(scene, camera);
  }
}


function animate() {
  requestAnimationFrame(animate);
  render();
}

function initRender() {
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setPixelRatio( window.devicePixelRatio );
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
      if(D3) {
        orbit.enablePan = true;
      } else {
        orbit.enabled = false;
      }
      break;
    case 73:
      window.InfoCard.hideInfoCard(!window.InfoCard.show);
    
  }
}

function onDocumentKeyUp(event) {
  switch (event.keyCode) {
    
    case 16: // Shift
      if(D3) {
        orbit.enablePan = false;
      } else {
        orbit.enabled = true;
      }
      
      break;
  }
  
}

function onSelectDown(event) {
  for (let i = 0; i < event.object.length; ++i) {
    let materials = event.object[i].material;
    if (materials.length) {
      for (let j = 0; j < materials.length; ++j) {
        materials[j].emissive.set(0x666600);
      }
    } else {
      materials.emissive.set(0x666600);
    }
    if (event.object[i].children.length > 0) {
      event.object[i].children[0].visible = true;
    }
    if (event.object[i].children.length > 1) {
      event.object[i].children[1].visible = false;
    }
  }
}

function onSelectUp(event) {
  for (let i = 0; i < event.object.length; ++i) {
    let materials = event.object[i].material;
    if (materials.length) {
      for (let j = 0; j < materials.length; ++j) {
        materials[j].emissive.set(0x000000);
      }
    } else {
      materials.emissive.set(0x000000);
    }
    if (event.object[i].children.length > 0) {
      event.object[i].children[0].visible = false;
    }
    if (event.object[i].children.length > 1) {
      event.object[i].children[1].visible = true;
    }
  }
  transformer.setSelected(event.object);
}
// APIs

function updateObjectPosition(uuid, position, model) {
  const o = scene.getObjectByProperty('uuid', uuid);
  // o.position.copy(position);
  if(D3) {
    gb.updateModel(o, model);
  } else {
    gb.Curve(window.objects);
  }
}

function scene3D() {
  D3 = true;
  window.objects = [];
  gui.initGUI();
  
  initRender();
  initScene();
  
  renderer.autoClear = false;
  multiCamera = new MultiCamera(scene, renderer);
  multiCamera.addGUI(gui.gui);
  camera = multiCamera.camera;
  initControls();
  
  sceneBasic = new SceneBasic(scene, renderer);
  sceneBasic.addGUI(gui.gui);
  
  archijson = new ArchiJSON(scene);
  archijson.addGUI(gui.gui);
  
  
}

function scene2D() {
  D3 = false;
  window.objects = [];
  gui.initGUI();
  
  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.OrthographicCamera(-50 * aspect, 50 * aspect, 50, -50, 0.01, 30000);
  camera.position.set(0, 0, 1000);
  
  initRender();
  renderer.autoClear = true;
  initScene2D();
  initControls();
}


function main() {
  InfoCard = window.InfoCard;
  if (D3) {
    scene3D();
  } else {
    scene2D();
  }
  animate();
}

export {
  main,
  scene2D,
  scene3D,
  
  updateObjectPosition,
  archijson,
}

/* eslint-disable no-unused-vars,no-case-declarations */
"use strict";
import * as THREE from 'three'
import * as ARCH from "@/archiweb"

let renderer, scene, gui;

let camera, drag;

let gb, assetManager;
window.objects = [];


function initScene() {
  scene.background = new THREE.Color(0xfafafa);
  
  
  gb = new ARCH.GeometryFactory(scene);
  
  const b1 = gb.Box([150, 150, 0], [300, 300, 300], new THREE.MeshLambertMaterial({color: 0xdddddd}));
  
  const b2 = gb.Box([-300, -300, 0], [300, 300, 100], new THREE.MeshLambertMaterial({color: 0xdddddd}));
  
  const b3 = gb.Box([300, -500, 0], [300, 300, 150], new THREE.MeshLambertMaterial({color: 0xdddddd}));
  
  const b4 = gb.Cylinder([-300, 0, 0], [50, 300, 4], new THREE.MeshLambertMaterial({color: 0xdddddd}), true);
  
  const loader = new ARCH.Loader(scene);
  loader.addGUI(gui.util);
  
  loader.loadModel('http://model.amomorning.com/tree/spruce-tree.dae', (mesh) => {
    mesh.position.set(0, -300, 0);
    ARCH.setMaterial(mesh, new THREE.MeshLambertMaterial({color: 0x99A083, transparent: true, opacity: 0.8}))
    ARCH.setPolygonOffsetMaterial(mesh.material);
    mesh.toCamera = true;
    assetManager.refreshSelection(scene);
  });
  
  loader.loadModel('http://model.amomorning.com/tree/autumn-tree.dae', (mesh) => {
    mesh.position.set(500, 0, 0);
    mesh.scale.set(2, 2, 2);
    ARCH.setPolygonOffsetMaterial(mesh.material);
    ARCH.setMaterialOpacity(mesh, 0.6);
    mesh.toCamera = true;
    assetManager.refreshSelection(scene);
  });
  
  
  assetManager.refreshSelection(scene);
  assetManager.addSelection([b1, b2, b3, b4], 1);
}


function initControls() {

  
  // //


}


// APIs

function updateObject(uuid, position, model) {
  const o = scene.getObjectByProperty('uuid', uuid);
  // o.position.copy(position);
  gb.updateModel(o, model);
}


function main() {
  const viewport = new ARCH.Viewport();
  scene = viewport.scene;
  renderer = viewport.renderer;
  gui = viewport.gui;
  camera = viewport.camera;

  assetManager = viewport.enableAssetManager();
  viewport.enableDragFrames();
  viewport.enableTransformer();
  
  initScene();
  
  const sceneBasic = new ARCH.SceneBasic(scene, renderer);
  sceneBasic.addGUI(gui.gui);
  
}

export {
  main,
  updateObject,
}

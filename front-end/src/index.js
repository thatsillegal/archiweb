/* eslint-disable no-unused-vars,no-case-declarations */

import * as ARCH from "@/archiweb"


let scene, renderer, gui, camera;
let gf, archijson;
let cube;

/* ---------- GUI setup ---------- */
function initGUI() {
  gui.gui.add(param, 'send');
}

const param = {
  send: function () {
    archijson.sendArchiJSON('engine', [cube])
  
  }
}

/* ---------- create your scene object ---------- */
function initScene() {
  gf = new ARCH.GeometryFactory(scene);
  archijson = new ARCH.ArchiJSON('c087f625-16dd-4185-8993-5f03115ea37b')
  
  
  cube = gf.Cuboid([0, 0, 0], [100, 100, 100]);
  
  // refresh global objects
  ARCH.refreshSelection(scene);
}


/* ---------- animate per frame ---------- */
function draw() {

}


/* ---------- main entry ---------- */
function main() {
  const viewport = new ARCH.Viewport();
  renderer = viewport.renderer;
  scene = viewport.scene;
  gui = viewport.gui;
  camera = viewport.to3D();
  
  viewport.enableSceneBasic();
  initGUI();
  initScene();
  
  viewport.draw = draw;
}

export {
  main
}
/* eslint-disable no-unused-vars,no-case-declarations */

import * as ARCH from "@/archiweb"
import {loaderOption} from "./creator/Loader";

let scene, renderer, gui, camera;
let gf, mt, am;

/* ---------- GUI setup ---------- */
function initGUI() {

}


/* ---------- create your scene object ---------- */
function initScene() {
  gf = new ARCH.GeometryFactory(scene);
  mt = new ARCH.MaterialFactory();
  
  loaderOption.status = 'raw';
  loaderOption.edge = true;
  loaderOption.doubleSide = false;
  const loader = new ARCH.Loader(scene);
  loader.addGUI(gui.util);
  loader.loadModel('/models/b_3dm/model.3dm', (mesh) => {
    mesh.scale.set(10, 10, 10);
    am.refreshSelection(scene);
  });
  
  // refresh global objects
}


/* ---------- animate per frame ---------- */
function draw() {

}


/* ---------- main entry ---------- */
function main() {
  console.warn = () => {
  };
  const viewport = new ARCH.Viewport();
  renderer = viewport.renderer;
  scene = viewport.scene;
  gui = viewport.gui;
  camera = viewport.camera;
  
  am = viewport.enableAssetManager();
  viewport.enableDragFrames();
  viewport.enableTransformer();
  viewport.enableSceneBasic();
  
  initGUI();
  initScene();
  
  viewport.draw = draw;
  
}

export {
  main
}
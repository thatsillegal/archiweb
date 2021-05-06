/* eslint-disable no-unused-vars,no-case-declarations */

import * as ARCH from "@/archiweb"
import {loaderOption} from "./creator/Loader";
import {applyTransformGroup} from "./editor/Transformer";

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
  loaderOption.doubleSide = true;
  const loader = new ARCH.Loader(scene);
  loader.addGUI(gui.util);
  loader.loadModel('/models/bugalow_fbx/model.fbx', (result) => {
    result.scale.set(0.1, 0.1, 0.1);
    applyTransformGroup(result);
    am.refreshSelection(scene);
  });
  // loader.loadModel('/models/test_ifc/example.ifc', (result) => {
  //   console.log(result);
  //   am.refreshSelection(scene);
  // });
  
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
  viewport.setCameraPosition([1120, 630, 450], [160, 135, 400]);
  
  am = viewport.enableAssetManager();
  viewport.enableDragFrames();
  viewport.enableTransformer();
  let sb = viewport.enableSceneBasic();
  sb.x = 1;
  sb.y = 0.5;
  sb.z = 0.6;
  sb.update();
  initGUI();
  initScene();
  
  viewport.draw = draw;
  
}

export {
  main
}
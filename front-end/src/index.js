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
  
  loaderOption.status = 'grouped';
  loaderOption.edge = true;
  loaderOption.doubleSide = true;
  const loader = new ARCH.Loader(scene);
  loader.loadModel('/models/test/model.dae', (mesh) => {
    mesh.position.x = -300;
    // mesh.traverse((m)=>{
    //   if(m.isMesh) {
    //   }
    // })
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
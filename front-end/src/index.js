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
  
  loaderOption.status = 'merged';
  loaderOption.edge = true;
  const loader = new ARCH.Loader(scene);
  loader.loadModel('/models/test_cube.dae', (mesh) => {
    mesh.position.set(-300, 0, 0);
    // ARCH.setPolygonOffsetMaterial(mesh.material);
    // const edge = ARCH.createMeshEdge(mesh);
    // scene.add(edge);
    am.refreshSelection(scene);
  });
  // refresh global objects
  am.refreshSelection(scene);
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
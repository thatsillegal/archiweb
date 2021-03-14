/* eslint-disable no-unused-vars,no-case-declarations */

import * as ARCH from "@/archiweb"
import * as THREE from "three"
import {building} from "@/assets/models/csg";

let scene, renderer, gui, camera;
let geoFty, matFty;
let astMgr;


/* ---------- create your scene object ---------- */
function initScene() {
  geoFty = new ARCH.GeometryFactory(scene);
  matFty = new ARCH.MaterialFactory();
  const geometry = new THREE.BufferGeometry();
// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
  
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(building.verts.flat(), 3))
  geometry.setIndex(building.faces.flat())
  geometry.computeVertexNormals()
  geometry.normalsNeedUpdate = true;
  const material = new THREE.MeshPhongMaterial({color: 0xdddddd, flatShading: true});
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = -600;
  ARCH.sceneAddMesh(scene, mesh)
}


/* ---------- main entry ---------- */
function main() {
  const viewport = new ARCH.Viewport();
  renderer = viewport.renderer;
  scene = viewport.scene;
  gui = viewport.gui;
  camera = viewport.camera;
  
  astMgr = viewport.enableAssetManager();
  viewport.enableDragFrames();
  viewport.enableTransformer();
  
  initScene();
  
  
  const sceneBasic = new ARCH.SceneBasic(scene, renderer);
  sceneBasic.addGUI(gui.gui);
}

export {
  main
}
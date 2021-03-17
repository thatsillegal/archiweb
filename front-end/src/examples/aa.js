/* eslint-disable no-unused-vars,no-case-declarations */

import * as ARCH from "@/archiweb"
import * as THREE from "three"
import {building} from "@/assets/models/csg";
import {ShapeUtils} from "three";
import * as earcut from "earcut";

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
  
  const position = [-200, 0, 0, 0, 0, -100, 200, 0, 0, 0, 0, 100];
  // 200, 0, 0];
  // const position = [-200, 0, 0, 0, -100, 0, 200, 0, 0, 0, 100, 0];
  // const position = [10,0,1, 0,50,2, 60,60,3, 70,10,4];
  console.log(geoFty.coordinatesToPoints(position, 3))
  const ix = earcut(position, null, 3);
  console.log(ix)
  const plane = new THREE.PlaneGeometry(100, 100);
  const index = [0, 1, 3, 1, 2, 3]
  plane.setAttribute('position', new THREE.Float32BufferAttribute(position, 3))
  plane.setIndex(index)
  // plane.vertices = geoFty.coordinatesToPoints(position, 3);
  plane.computeFaceNormals()
  plane.computeVertexNormals()
  
  ARCH.sceneAddMesh(scene, new THREE.Mesh(plane, matFty.Doubled()))
  
  scene.add(new THREE.Mesh(plane, matFty.Flat()));
  ARCH.sceneAddMesh(scene, mesh)
  
  ARCH.refreshSelection(scene);
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
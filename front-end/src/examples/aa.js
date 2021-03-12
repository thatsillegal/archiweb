/* eslint-disable no-unused-vars,no-case-declarations */

import * as ARCH from "@/archiweb"
import * as THREE from "three"
import {Geometry, Face3} from "three/examples/jsm/deprecated/Geometry"

let scene, renderer, gui, camera;
let geoFty, matFty;
let astMgr;

/* ---------- GUI setup ---------- */
function initGUI() {

}


/* ---------- create your scene object ---------- */
function initScene() {
  geoFty = new ARCH.GeometryFactory(scene);
  matFty = new ARCH.MaterialFactory();
  const geometry = new Geometry();
// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
  const test = {
    verts: [
      [1055.5488810559277, 223.62985233130985, 0],
      [950.220444680404, -174.9498006713706, 100],
      [755.5488810559278, 300, 300],
      [755.5488810559278, 0, 100],
      [873.5331585297903, 0, 100],
      [1055.5488810559277, 300, 300],
      [1055.5488810559277, 300, 0],
      [873.5331585297903, -76.37014766869015, 100],
      [950.220444680404, -76.37014766869015, 100],
      [650.220444680404, 125.05019932862939, 0],
      [755.5488810559278, 0, 300],
      [1173.5331585297904, 223.62985233130985, 150],
      [1055.5488810559277, 223.62985233130985, 150],
      [755.5488810559278, 125.05019932862939, 0],
      [1173.5331585297904, -76.37014766869015, 0],
      [755.5488810559278, 300, 0],
      [950.220444680404, -76.37014766869015, 0],
      [950.220444680404, -174.9498006713706, 0],
      [650.220444680404, -174.9498006713706, 0],
      [755.5488810559278, 125.05019932862939, 100],
      [650.220444680404, 125.05019932862939, 100],
      [1173.5331585297904, 223.62985233130985, 0],
      [650.220444680404, -174.9498006713706, 100],
      [1173.5331585297904, -76.37014766869015, 150],
      [873.5331585297903, 0, 150],
      [873.5331585297903, -76.37014766869015, 150],
      [1055.5488810559277, 0, 150],
      [1055.5488810559277, 0, 300]
    ],
    faces: [
      [18, 16, 17], [20, 9, 18], [2, 10, 27],
      [12, 11, 21], [19, 10, 2], [20, 3, 19],
      [6, 12, 0], [8, 14, 23], [9, 20, 19],
      [22, 18, 17], [2, 5, 6], [25, 26, 24],
      [14, 21, 11], [1, 17, 16], [27, 24, 26],
      [24, 4, 7], [18, 9, 13], [13, 15, 0],
      [18, 13, 16], [0, 15, 6], [21, 14, 0],
      [0, 14, 16], [0, 16, 13], [22, 20, 18],
      [5, 2, 27], [0, 12, 21], [3, 10, 19],
      [2, 15, 19], [19, 15, 13], [22, 1, 7],
      [7, 1, 8], [22, 7, 3], [3, 7, 4],
      [20, 22, 3], [5, 27, 12], [12, 27, 26],
      [6, 5, 12], [16, 14, 8], [23, 25, 8],
      [8, 25, 7], [13, 9, 19], [1, 22, 17],
      [15, 2, 6], [23, 11, 26], [26, 11, 12],
      [25, 23, 26], [23, 14, 11], [8, 1, 16],
      [10, 3, 24], [24, 3, 4], [10, 24, 27],
      [25, 24, 7]
    ],
    colors: ['-1'],
    col_FaceNum: [52]
  }
  for (let i = 0; i < test.verts.length; ++i) {
    const vt = test.verts[i];
    geometry.vertices.push(new THREE.Vector3(vt[0], vt[1], vt[2]));
  }
  
  for (let i = 0; i < test.faces.length; ++i) {
    const fs = test.faces[i];
    geometry.faces.push(new Face3(fs[0], fs[1], fs[2]));
  }
// itemSize = 3 because there are 3 values (components) per vertex
  geometry.computeFaceNormals()
  geometry.normalsNeedUpdate = true;
  const material = new THREE.MeshLambertMaterial({color: 0xdddddd});
  const mesh = new THREE.Mesh(geometry.toBufferGeometry(), material);
  ARCH.sceneAddMesh(scene, mesh)
  // refresh global objects
  // ARCH.refreshSelection();
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
  
  astMgr = viewport.enableAssetManager();
  viewport.enableDragFrames();
  viewport.enableTransformer();
  
  initGUI();
  initScene();
  
  viewport.draw = draw;
  
  const sceneBasic = new ARCH.SceneBasic(scene, renderer);
  sceneBasic.addGUI(gui.gui);
}

export {
  main
}
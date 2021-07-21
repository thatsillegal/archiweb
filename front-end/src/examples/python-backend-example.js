"use strict";
import * as THREE from 'three'
import * as ARCH from "@/archiweb"
import {token} from "@/sensitiveInfo";


let scene, gui;
let gf, am, mt;

let vs, fs, mesh, rawmesh;

const control = {}

function initArchiJSON() {
  let archijson = new ARCH.ArchiJSON(token);
  
  // set send button
  control.send = function () {
    archijson.sendArchiJSON('python-backend', [rawmesh]);
  }
  gui.gui.add(control, 'send');
  
  
  archijson.onReceive = function (obj) {
    
    mesh = gf.Mesh(obj.vertices, obj.faces, mt.Doubled());
    
    am.addSelection([mesh], 1);
    am.refreshSelection(scene);
  }
}




function initScene() {
  
  gf = new ARCH.GeometryFactory(scene);
  mt = new ARCH.MaterialFactory();
  
  let pts = []
  for (let i = 0; i < 11; ++i) {
    for (let j = 0; j < 11; ++j) {
      pts.push(new THREE.Vector3(i * 100, j * 100, 0));
    }
  }
  
  
  vs = gf.Vertices(pts);
  fs = []
  for (let i = 0; i < 10; ++i) {
    for (let j = 0; j < 10; ++j) {
      let face = [i * 11 + j, i * 11 + j + 1, (i + 1) * 11 + j + 1, (i + 1) * 11 + j];
      gf.Segments(face.map(id => pts[id]), true)
      fs.push(...face)
    }
  }
  rawmesh = gf.Mesh(vs.toArchiJSON(), {index: fs, count: [fs.length / 4], size: [4]})
  rawmesh.visible = false;
  
  
  control.send();
  am.refreshSelection(scene);
  
}

function main() {
  const viewport = new ARCH.Viewport();
  scene = viewport.scene;
  gui = viewport.gui;
  
  viewport.setCameraPosition([1400, -800, 300], [600, 250, 200]);
  
  am = viewport.enableAssetManager();
  viewport.enableDragFrames();
  viewport.enableTransformer();
  let sb = viewport.enableSceneBasic();
  sb.skyColor = '#e0e8ef'
  sb.floorColor = '#ffffff'
  sb.update();
  
  
  initArchiJSON();
  initScene();
}

export {
  main
}

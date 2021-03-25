/* eslint-disable no-unused-vars,no-case-declarations */
"use strict";
import * as THREE from 'three'
import * as ARCH from "@/archiweb"
import socket from "@/socket"

let renderer, scene, gui;

let camera;

let gf, am;

const param = {
  a: 1,
  b: 2,
  c: 3
}

const control = {
  send: function () {
    socket.emit('paramExchange', {param: param});
  }
}

function initWS() {
  socket.on('generate', async function (message) {
    console.log(message);
  })
}

function initGUI() {
  gui.gui.add(param, 'a', 1, 10, 1);
  gui.gui.add(param, 'b', 1, 10, 1);
  gui.gui.add(param, 'c', 1, 10, 1);
  gui.gui.add(control, 'send');
}

function initScene() {
  
  gf = new ARCH.GeometryFactory(scene);
  const mt = new ARCH.MaterialFactory();
  
  const b1 = gf.Cuboid([150, 150, 0], [300, 300, 300], mt.Matte());
  
  const b2 = gf.Cuboid([-300, -300, 0], [300, 300, 100], mt.Matte());
  
  const b3 = gf.Cuboid([300, -500, 0], [300, 300, 150], mt.Matte());
  
  
  am.refreshSelection(scene);
  am.addSelection([b1, b2, b3], 1);
  am.setCurrentID(1);
  
}

function main() {
  const viewport = new ARCH.Viewport();
  scene = viewport.scene;
  renderer = viewport.renderer;
  gui = viewport.gui;
  camera = viewport.camera;
  
  am = viewport.enableAssetManager();
  viewport.enableDragFrames();
  viewport.enableTransformer();
  viewport.enableSceneBasic();
  
  
  initScene();
  initGUI();
  initWS();
}

export {
  main
}

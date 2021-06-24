/* eslint-disable no-unused-vars,no-case-declarations */

import * as ARCH from "@/archiweb"


let scene, renderer, gui, camera;
let gf, a;
/* ---------- GUI setup ---------- */
function initGUI() {
  gui.gui.add(param, 'send');
  gui.gui.add(param, 'quick');
}

const param = {
  send: function () {
    a.socket.emit('bts:sendGeometry', {greeting: 'hello'});
  },
  quick: function () {
    a.socket.emit('quick', 'hello', ret => {
      console.log(ret);
    })
  }
}

/* ---------- create your scene object ---------- */
function initScene() {
  gf = new ARCH.GeometryFactory(scene);
  a = new ARCH.ArchiJSON(scene, gf)
  
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
  camera = viewport.to2D();
  
  initGUI();
  initScene();
  
  viewport.draw = draw;
}

export {
  main
}
import * as ARCH from "@/archiweb"
import * as THREE from "three";

let scene, renderer, gui;
let geoFty, matFty, astMgr;
let archijson;
let reconstructed = [];
let cl = []
let l1, f1, shape;
/* ---------- GUI setup ---------- */
function initGUI() {
  const control = {
    send: function() {
      reconstructed.forEach((it)=> {it.parent.remove(it);})
      reconstructed = [];
      archijson.sendArchiJSON('bts:sendGeometry', window.objects);
    }
  }
  gui.gui.add(control, 'send');
}

function parseGeometry(geometryElements) {
  for(let e of geometryElements) {
    let b = scene.getObjectByProperty('uuid', e.uuid);
  
    if(!b) {
      b = geoFty[e.type]();
      reconstructed.push(b);
    }
    
    b.fromArchiJSON(b, e);
  }
  ARCH.refreshSelection(scene);
}


/* ---------- create your scene object ---------- */
function initScene() {
  geoFty = new ARCH.GeometryFactory(scene);
  matFty = new ARCH.MaterialFactory();
  archijson = new ARCH.ArchiJSON(scene, geoFty);
  
  const b1 = geoFty.Cuboid([100, 100, 0],[200, 200, 300], matFty.Matte(0xff0000));
  
  const c1 = geoFty.Cylinder([400, 300, 0], [100, 400], matFty.Matte(0xffff00), true);
  
  const p1 = geoFty.Plane([-600, 300, 5], [600, 600], matFty.Matte(0xff00ff), true)
  
  const points = [[-190, 730, 6], [320, 940, 6], [520, 640, 6], [240, 410, 6], [50, 500, 6], [-110, 460, 6]]
  points.forEach((p)=>cl.push(geoFty.Sphere(p, 10, matFty.Flat(0xff0000))));
  
  l1 = geoFty.Segments(cl.map((handle)=>handle.position), true);
  cl.forEach((c)=>c.parent=l1);
  
  shape = new THREE.Shape().setFromPoints(cl.map((handle)=>handle.position));
  f1 = geoFty.Prism(shape,
    matFty.Matte(0x0000ff), 5, 1)
  
  console.log(shape)
  // refresh global objects
  ARCH.refreshSelection(scene);
  astMgr.addSelection(cl, 2)
  astMgr.addSelection([b1, c1, p1, f1], 1);
  astMgr.setCurrentID(2);
  
  /* ---------- handle returned object ---------- */
  archijson.parseGeometry = parseGeometry;
}

window.searchSceneByUUID = function(uuid) {
  return scene.getObjectByProperty('uuid', uuid);
}


function draw() {
  if(l1.dragging) {
    
    l1.geometry.setFromPoints(cl.map((handle) => handle.position));
    // f1.parent.remove(f1);
    shape = new THREE.Shape().setFromPoints(cl.map((handle) => handle.position));
    f1.updateModel(f1, {shape: shape, height: 5, extruded: 1});
  
  }
  
}


/* ---------- main entry ---------- */
function main() {
  const viewport = new ARCH.Viewport();
  renderer = viewport.renderer;
  scene = viewport.scene;
  gui = viewport.gui;
  
  astMgr = viewport.enableAssetManager();
  viewport.enableDragFrames();
  viewport.enableTransformer();
  
  viewport.draw = draw;
  initGUI();
  initScene();
  
  const sceneBasic = new ARCH.SceneBasic(scene, renderer);
  sceneBasic.addGUI(gui.gui);
}

export {
  main
}
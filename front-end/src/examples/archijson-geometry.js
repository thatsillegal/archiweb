import * as ARCH from "@/archiweb"

let scene, renderer, gui;
let geoFty, matFty, astMgr;
let archijson;
let reconstructed = [];

/* ---------- GUI setup ---------- */
function initGUI() {
  const control = {
    send: function() {
      reconstructed.forEach((it)=> {
        it.parent.remove(it);
      })
      reconstructed = [];
      archijson.sendArchiJSON('bts:sendGeometry', window.objects);
    }
  }
  gui.gui.add(control, 'send');
}


/* ---------- create your scene object ---------- */
function initScene() {
  geoFty = new ARCH.GeometryFactory(scene);
  matFty = new ARCH.MaterialFactory();
  
  const b1 = geoFty.Box([100, 100, 0],[200, 200, 300], matFty.Matte());
  
  archijson = new ARCH.ArchiJSON(scene, geoFty);
  
  // refresh global objects
  ARCH.refreshSelection(scene);
  astMgr.addSelection([b1], 1);
  astMgr.setCurrentID(1);
  
  archijson.sendArchiJSON('bts:sendGeometry', window.objects);
  archijson.parseGeometry = (geometryElements)=>{
    for(let e of geometryElements) {
      let p = e.position;
      reconstructed.push(geoFty.Box([p.x, p.y, p.z], [e.w, e.h, e.d], matFty.Matte() ));
    }
    ARCH.refreshSelection(scene);
  }
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
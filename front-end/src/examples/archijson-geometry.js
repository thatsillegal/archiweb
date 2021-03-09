import * as ARCH from "@/archiweb"

let scene, renderer, gui;
let geoFty, matFty, astMgr;
let archijson;
let reconstructed = [];

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
  
  
  
  
  
  // refresh global objects
  ARCH.refreshSelection(scene);
  astMgr.addSelection([b1, c1, p1], 1);
  astMgr.setCurrentID(1);
  
  /* ---------- handle returned object ---------- */
  archijson.parseGeometry = parseGeometry;
}

window.searchSceneByUUID = function(uuid) {
  return scene.getObjectByProperty('uuid', uuid);
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
  
  const sceneBasic = new ARCH.SceneBasic(scene, renderer);
  sceneBasic.addGUI(gui.gui);
}

export {
  main
}
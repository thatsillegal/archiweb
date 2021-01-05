import * as THREE from 'three'
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
  const c1 = geoFty.Cylinder([400, 300, 0], [100, 400], matFty.Matte(0xffff00), true);
  console.log('b1', b1);
  
  archijson = new ARCH.ArchiJSON(scene, geoFty);
  
  // refresh global objects
  ARCH.refreshSelection(scene);
  astMgr.addSelection([b1, c1], 1);
  astMgr.setCurrentID(1);
  
  archijson.parseGeometry = (geometryElements)=>{
    for(let e of geometryElements) {
  
      console.log(e)
      let b = scene.getObjectByProperty('uuid', e.uuid);
      let re = !b;
      b = re ? geoFty.Box(): b;
      
      const m = new THREE.Matrix4().fromArray(e.matrix);
      const scale = new THREE.Vector3();
      const position = new THREE.Vector3();
      const quaternion = new THREE.Quaternion();
      
      m.decompose(position, quaternion, scale);
      // console.log(quaternion)
      b.quaternion.copy(quaternion);
      b.position.copy(position);
      b.scale.copy(scale);

      console.log(b)
      
      if(re) reconstructed.push(b);
    }
    ARCH.refreshSelection(scene);
  }
}

window.searchSceneByUUID = function(uuid) {
  return scene.getObjectByProperty('uuid', uuid);
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
import * as ARCH from "@/archiweb";
import * as THREE from "three";

let scene;

function initScene() {
  
  const mf = new ARCH.MaterialFactory();
  const material = mf.Doubled();
  
  const gf = new ARCH.GeometryFactory(scene);
  gf.Box([900, 150, 0], [300, 300, 300], material);
  gf.Box([1000, 0, 0], [300, 300, 100], material);
  
  const b = new THREE.BoxBufferGeometry(1, 1, 1);
  b.translate(0, 0, 0.5);
  const b3 = new THREE.Mesh(b, material);
  b3.scale.set(300, 300, 300);
  scene.add(b3);
  
}

function main() {
  const viewport = new ARCH.Viewport();
  scene = viewport.scene;
  
  const sceneBasic = new ARCH.SceneBasic(scene, viewport.renderer);
  sceneBasic.addGUI(viewport.gui.gui);
  initScene();
}

export {
  main
}
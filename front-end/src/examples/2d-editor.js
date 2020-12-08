import * as THREE from "three";
import * as ARCH from "@/archiweb"


import {DragControls} from "three/examples/jsm/controls/DragControls";


let scene, renderer, gui, camera;
let drag, controller;
let gb;

function initScene() {
  
  const axes = new THREE.AxesHelper(50)
  scene.add(axes);
  gb = new ARCH.GeometryFactory(scene);
  let controls = {
    color: 0xfafafa
  };
  scene.background = new THREE.Color(controls.color);
  
  gui.gui.addColor(controls, 'color').onChange(function () {
    scene.background = new THREE.Color(controls.color);
  });
  
  
  const light = new THREE.SpotLight(0xffffff, 1.5);
  light.position.set(0, 0, 1000);
  scene.add(light);
  
  let pos = [[-10, 30], [0, 10], [30, -10], [40, -30], [50, -50]];
  let cl = [];
  for (let p of pos) {
    cl.push(gb.Cylinder(p, [1, 1],
      new THREE.MeshLambertMaterial({color: 0xff0000})));
  }
  console.log(cl.length);
  
  ARCH.refreshSelection(scene);
  gb.Curve(cl);
  
}

function around(position) {
  position.x = Math.round(position.x);
  position.y = Math.round(position.y);
  position.z = Math.round(position.z);
}

function initDrag() {
  drag = new DragControls(window.objects, camera, renderer.domElement);
  drag.addEventListener('hoveron', function (event) {
    let o = event.object;
    around(o.position);
    
    o.toInfoCard();
    controller.enabled = false;
  });
  drag.addEventListener('hoveroff', function () {
    controller.enabled = true;
  });
  drag.addEventListener('dragend', function (event) {
    let o = event.object;
    around(o.position);
    
    o.toInfoCard();
    gb.Curve(window.objects);
  });
  drag.addEventListener('drag', function () {
    gb.Curve(window.objects);
  })
}


function updateObject(uuid, position) {
  const o = scene.getObjectByProperty('uuid', uuid);
  o.position.copy(position);
  gb.Curve(window.objects);
}

function main() {
  const viewport = new ARCH.Viewport();
  renderer = viewport.renderer;
  
  scene = viewport.scene;
  gui = viewport.gui;
  controller = viewport.controller;
  
  camera = viewport.to2D();
  console.log(camera);
  
  initScene();
  initDrag();

}

export {
  main,
  updateObject,
  
}

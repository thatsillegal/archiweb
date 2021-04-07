/* eslint-disable no-unused-vars,no-case-declarations */
"use strict";
import * as THREE from 'three'
import * as ARCH from "@/archiweb"
let renderer, scene, controller;
let gf, am, mt;

let camera;
let piedata = [
  {label:'hi', val:0.1},
  {label:'hilo', val:0.4},
  {label:'hie', val:0.2},
  {label:'hias', val:0.2},
  {label:'hisd', val:0.1},
]

function createPieChart(data) {
  
  let cur = 0;
  let circles = new THREE.Group();
  data.forEach((e)=>{
    let color = new THREE.Color().setHSL(0.07, 0.3, (1.0 - cur/Math.PI/2.0) * 0.4 + 0.2 ).getHex();
    let c = new THREE.CircleGeometry(400, 16, cur, Math.PI *2.0 * e.val)
  
    let mesh = new THREE.Mesh(c, mt.Matte(color))
    mesh.add(ARCH.createMeshEdge(mesh));
    circles.add(mesh)
  
    e.color = color;
    cur += Math.PI *2.0 * e.val;
  })
  circles.position.x = -200;
  
  let y = 0;

  const loader = new THREE.FontLoader();
  
  loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
    data.forEach((e)=>{
      gf.Plane([300, y, 0], [50, 50], mt.Matte(e.color));
  
      const text = new THREE.TextGeometry( e.label, {
        font: font,
        size: 50,
        height: 5,
      } );
      let mesh = new THREE.Mesh(text, mt.Matte(0x000));
      mesh.position.set(380, y-25, 0);
      scene.add(mesh);
  
      y -= 80;
    })
  
  } );
  scene.add(circles);
}

function initScene() {
  
  
  gf = new ARCH.GeometryFactory(scene);
  mt = new ARCH.MaterialFactory();
  const light = new THREE.SpotLight(0xffffff, 1.5);
  light.position.set(0, 0, 1000);
  scene.add(light);
  
  // let c = gf.Cylinder([0,0,0], [100,5]);
  // let c = new THREE.CircleGeometry(100, 8, 0, Math.PI/3);
  //
  // scene.add(new THREE.Mesh(c, mt.Matte(0xdddddd)));
  
  createPieChart(piedata);
}

function main() {
  const size = document.getElementById('container').clientWidth;
  
  const viewport = new ARCH.Viewport(size, size/3*2, 'piechart');
  renderer = viewport.renderer;
  controller = viewport.controller;
  controller.enabled = false;
  
  scene = viewport.scene;
  
  camera = viewport.to2D();
  
  am = viewport.enableAssetManager();
  viewport.disableGUI();
  initScene();
  
}

export {
  main
}

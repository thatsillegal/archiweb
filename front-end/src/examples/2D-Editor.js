import * as THREE from "three";
import AssetManager from "@/creator/AssetManager";
import * as gui from "@/gui";
import GeometryFactory from "@/creator/GeometryFactory";

import {DragControls} from "three/examples/jsm/controls/DragControls";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";


let scene, renderer, camera;
let orbit, drag;

let gb, assetManager;
function init() {
  renderer.autoClear = true;
  
  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.OrthographicCamera(-50 * aspect, 50 * aspect, 50, -50, 0.01, 30000);
  camera.position.set(0, 0, 1000);
  
  
  initScene();
  initControls();
}

function initScene() {
  scene = new THREE.Scene();
  assetManager = new AssetManager(scene);
  assetManager.addGUI(gui.util);
  
  gb = new GeometryFactory(scene);
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
  
  assetManager.refreshSelection();
  gb.Curve(cl);
  
}

function initControls() {
  if (orbit !== undefined) orbit.dispose();
  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableRotate = false;
  
  initDrag();
}

function initDrag() {
  drag = new DragControls(window.objects, camera, renderer.domElement);
  drag.addEventListener('hoveron', function (event) {
    let o = event.object;
    o.toInfoCard();
    orbit.enabled = false;
  });
  drag.addEventListener('hoveroff', function () {
    orbit.enabled = true;
  });
  drag.addEventListener('dragend', function (event) {
    
    let o = event.object;
    o.toInfoCard();
    gb.Curve(window.objects);
  });
  drag.addEventListener('drag', function () {
    gb.Curve(window.objects);
  })
}


function onDocumentKeyDown(event) {
  switch (event.keyCode) {
    case 16: // Shift
      orbit.enabled = false;
      break;
    case 73:
      window.InfoCard.hideInfoCard(!window.InfoCard.show);
    
  }
}

function onDocumentKeyUp(event) {
  switch (event.keyCode) {
    
    case 16: // Shift
      orbit.enabled = true;
      break;
  }
  
}

function updateObject(uuid, position) {
  const o = scene.getObjectByProperty('uuid', uuid);
  o.position.copy(position);
  gb.Curve(window.objects);
}



function windowResize(w, h) {
  camera.left = camera.bottom * w / h;
  camera.right = camera.top * w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  
  render();
}

function render() {
  renderer.render(scene, camera);
}


function animate() {
  requestAnimationFrame(animate);
  render();
}

function initRender() {
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  addToDOM();
}

function addToDOM() {
  const container = document.getElementById('container');
  const canvas = container.getElementsByTagName('canvas');
  if (canvas.length > 0) {
    container.removeChild(canvas[0]);
  }
  container.appendChild(renderer.domElement);
  
  window.onresize = function () {
    windowResize(window.innerWidth, window.innerHeight);
  };
  renderer.domElement.addEventListener('keydown', onDocumentKeyDown, false);
  renderer.domElement.addEventListener('keyup', onDocumentKeyUp, false);
}



function main() {
  window.objects = [];
  gui.initGUI();
  initRender();
  
  init();
  animate();
}

export {
  main,
  updateObject,
  
}

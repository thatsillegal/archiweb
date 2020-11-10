/* eslint-disable no-unused-vars,no-case-declarations */
"use strict";

import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial';
import {Wireframe} from "three/examples/jsm/lines/Wireframe";
import {WireframeGeometry2} from "three/examples/jsm/lines/WireframeGeometry2";


import {DragFrames} from "@/viewers/DragFrames";
import {SceneBasic} from "@/viewers/SceneBasic";
import {Transformer} from "@/viewers/Transformer";
import {MultiCamera} from "@/viewers/MultiCamera";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {ColladaLoader} from "three/examples/jsm/loaders/ColladaLoader";

const gui = require('@/viewers/3D/gui')

let renderer, scene;
let orbit;
let sceneBasic, dragFrames, transformer;
let multiCamera;
let buffer = new Float32Array();


const objects = [];

function initRender() {
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.autoClear = false;
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  addToDOM();
}



function meshLine(geometry, color, linewidth) {
  const matLine = new LineMaterial({color: color, linewidth: linewidth});
  const geoLine = new WireframeGeometry2(geometry);
  const wireframe = new Wireframe(geoLine, matLine);
  wireframe.computeLineDistances();
  wireframe.scale.set(1, 1, 1);
  return wireframe;
}

function initScene() {
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfafafa);
  
  const box = new THREE.BoxBufferGeometry(300, 300, 300);
  const edges = new THREE.EdgesGeometry(box);
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0x000000}));
  // box.scale(0.001, 0.001, 0.001);
  
  
  const b1 = new THREE.Mesh(box, new THREE.MeshLambertMaterial({color: 0xdddddd}));
  b1.position.set(150, 150, 150);
  sceneAddMesh(b1, line.clone());
  
  const b2 = new THREE.Mesh(box, new THREE.MeshLambertMaterial({color: 0xdddddd}));
  b2.scale.set(1, 1, 1.0 / 3);
  b2.position.set(-300, -300, 50);
  
  sceneAddMesh(b2, line.clone());
  
  const b3 = new THREE.Mesh(box, new THREE.MeshLambertMaterial({color: 0xdddddd}));
  b3.scale.set(1, 1, 1.0 / 2);
  b3.position.set(300, -500, 75);
  
  sceneAddMesh(b3, line.clone());
  
  
  
  sceneBasic = new SceneBasic(scene, renderer);
  sceneBasic.addGUI(gui.gui);
  
  let loader = new ColladaLoader();
  loader.load('/models/spruce-tree.dae', function (obj) {
    let meshGeometry = new THREE.Geometry();
    let lineGeometry = new THREE.BufferGeometry();
  
  
    buffer = new Float32Array();
    searchChild(obj.scene, meshGeometry);

    lineGeometry.setAttribute( 'position', new THREE.BufferAttribute( buffer, 3 ) );
  
    const line = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({color: 0x000000}));
    const tree = new THREE.Mesh(meshGeometry, new THREE.MeshLambertMaterial({color: 0x567736, transparent:true, opacity:0.6}));
    tree.position.set(0, -200, 0);
    sceneAddMesh(tree, line);
  });
  
  loader.load('/models/apple-tree.dae', function (obj) {
    let meshGeometry = new THREE.Geometry();
    let lineGeometry = new THREE.BufferGeometry();
    
    
    buffer = new Float32Array();
    searchChild(obj.scene, meshGeometry);
    
    lineGeometry.setAttribute( 'position', new THREE.BufferAttribute( buffer, 3 ) );
    
    const line = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({color: 0x000000}));
    const tree = new THREE.Mesh(meshGeometry, new THREE.MeshLambertMaterial({color: 0x567736, transparent:true, opacity:0.6}));
    tree.position.set(500, 200, 0);
    sceneAddMesh(tree, line);
  });
  
  // loader.load('/models/deciduous-tree.dae', function (obj) {
  //   let meshGeometry = new THREE.Geometry();
  //   let lineGeometry = new THREE.BufferGeometry();
  //
  //
  //   buffer = new Float32Array();
  //   searchChild(obj.scene, meshGeometry);
  //
  //   lineGeometry.setAttribute( 'position', new THREE.BufferAttribute( buffer, 3 ) );
  //
  //   const line = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({color: 0x000000}));
  //   const tree = new THREE.Mesh(meshGeometry, new THREE.MeshLambertMaterial({color: 0x567736, transparent:true, opacity:0.6}));
  //   tree.position.set(-300, -500, 0);
  //   sceneAddMesh(tree, line);
  // });
  
}

function searchChild(object, meshGeometry) {
  if(object.isMesh) {
    const childGeometry = new THREE.Geometry().fromBufferGeometry( object.geometry );
    let matrix = object.matrix;
    if(object.parent) {
      matrix = object.parent.matrix;
      console.log(matrix);
    }
    meshGeometry.merge(childGeometry, matrix);
    return;
  }
  if(object.isLineSegments) {
    const posArr = object.geometry.getAttribute('position').array;
    buffer = Float32Concat(buffer, posArr);
    return;
  }
  
  if(object.children !== undefined) {
    for(let i = 0; i < object.children.length; ++ i) {
      searchChild(object.children[i], meshGeometry);
    }
  }
}

function sceneAddMesh(mesh, line) {
  mesh.add(meshLine(mesh.geometry, 0xffff00, 0.005));
  mesh.add(line);
  mesh.children[0].visible = false;
  
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  
  objects.push(mesh);
  scene.add(mesh);
}

function Float32Concat(first, second)
{
  let firstLength = first.length,
    result = new Float32Array(firstLength + second.length);
  
  result.set(first);
  result.set(second, firstLength);
  
  return result;
}
function initDragFrames() {
  
  dragFrames = new DragFrames(objects, multiCamera.camera, scene, renderer);
  dragFrames.enabled = true;
  
  dragFrames.addEventListener('selectdown', function (event) {
    transformer.clear();
  });
  
  dragFrames.addEventListener('select', function (event) {
    for (let i = 0; i < event.object.length; ++i) {
      if(event.object[i].material)
        event.object[i].material.emissive.set(0x666600);
      if (event.object[i].children.length > 0) {
        event.object[i].children[0].visible = true;
      }
      if (event.object[i].children.length > 1) {
        event.object[i].children[1].visible = false;
      }
    }
  });
  
  dragFrames.addEventListener('selectup', function (event) {
    for (let i = 0; i < event.object.length; ++i) {
      if(event.object[i].material)
        event.object[i].material.emissive.set(0x000000);
      if (event.object[i].children.length > 0) {
        event.object[i].children[0].visible = false;
      }
      if (event.object[i].children.length > 1) {
        event.object[i].children[1].visible = true;
      }
    }
    transformer.setSelected(event.object);
  });
}


function initControls() {
  
  orbit = new OrbitControls(multiCamera.camera, renderer.domElement);
  orbit.enablePan = false;
  
  orbit.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    RIGHT: THREE.MOUSE.ROTATE
  }
  multiCamera.addControllers(orbit);
  
  initDragFrames();
  
  transformer = new Transformer(scene, renderer, multiCamera.camera, objects, dragFrames);
  transformer.addGUI(gui.gui);
  
  multiCamera.addControllers(transformer);
  
}

function windowResize(w, h) {
  
  multiCamera.onWindowResize(w, h);
  dragFrames.onWindowResize(w, h);
  
  renderer.setSize(w, h);
  
  render();
}


function render() {
  
  // console.log(multiCamera.camera);
  renderer.clear();
  renderer.render(scene, multiCamera.camera);

  if (dragFrames !== undefined)
    dragFrames.render();
}


function animate() {
  
  orbit.update();
  render();
  
  requestAnimationFrame(animate);
}


function onDocumentKeyDown(event) {
  switch (event.keyCode) {
    case 16: // Shift
      orbit.enablePan = true;
      break;
    
  }
  
}

function onDocumentKeyUp(event) {
  switch (event.keyCode) {
    
    case 16: // Shift
      orbit.enablePan = false;

      break;
    
  }
  
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

function init() {
  
  gui.initGUI();
  
  initRender();
  initScene();
  
  multiCamera = new MultiCamera(scene, renderer);
  multiCamera.addGUI(gui.gui);
  initControls();
  
  
}

function main() {
  init();
  animate();
}

export {
  main,
}

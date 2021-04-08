/* eslint-disable no-unused-vars,no-case-declarations */
"use strict";
import * as ARCH from "@/archiweb"
import socket from "@/socket";
import * as THREE from "three";

let renderer, scene, gui;
let gf, am, mt;

let camera;
let environment;

let buildings = [], block;

function clear(list) {
  if(list !== undefined)
    list.forEach((e)=>e.parent.remove(e));
  list = [];
}

function initWS() {
  socket.on('stb:loadFromDatabase', async function (geometryElements) {
    clear(buildings);
    environment.clear();
    console.log('loading')
    
    for(let e of geometryElements) {
      let points = gf.coordinatesToPoints(e.coordinates, e.size);
      
      if(e.properties.type === 'building') {
        let building = gf.Segments(points, e.closed, 0, true);
        building.material = mt.Doubled(0);
        ARCH.setPolygonOffsetMaterial(building.material);
        buildings.push(building);
      } else if (e.properties.type === 'road'){
        environment.add(gf.Segments(points, e.closed));
      } else if (e.properties.type === 'block') {
        block = gf.Segments(points, e.closed, 0xffffff, true);
        block.material = mt.Doubled(0xffffff);
        block.position.z = -5;
        ARCH.setPolygonOffsetMaterial(block.material);
      } else{
        let building = gf.Segments(points, e.closed, 0x444444, true);
        building.material = mt.Doubled(0x222222);
        ARCH.setPolygonOffsetMaterial(building.material);
        building.position.z = -5;
        environment.add(building);
      }
    }
  });
}

function initScene() {
  scene.background = new THREE.Color('0xcccccc');
  
  gf = new ARCH.GeometryFactory(scene);
  mt = new ARCH.MaterialFactory();
  const light = new THREE.SpotLight(0xffffff, 1.1);
  light.position.set(0, 0, 1000);
  scene.add(light);
  gf.Plane([0, 0, -10], [10000, 10000], mt.Matte(0xaaaaaa));
  environment = new THREE.Group();
  scene.add(environment);
  socket.emit('bts:initFromDatabase', {properties: {id:10}})
  
}

function main() {
  const size = document.getElementById('container').clientWidth;
  
  const viewport = new ARCH.Viewport(size, size);
  renderer = viewport.renderer;
  
  scene = viewport.scene;
  
  camera = viewport.to2D();
  camera.zoom = 3;
  camera.updateProjectionMatrix();
  
  am = viewport.enableAssetManager();
  viewport.disableGUI();
  
  initWS();
  initScene();
  
}

export {
  main
}

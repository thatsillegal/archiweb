/* eslint-disable no-unused-vars,no-case-declarations */
"use strict";
import * as THREE from 'three'
import * as ARCH from "@/archiweb"
import socket from "@/socket";
import {setPolygonOffsetMaterial} from "@/archiweb";
let renderer, scene, gui;
let gf, am, mt;

let camera;

let roads = [], buildings = [];

function clear(list) {
  if(list !== undefined)
    list.forEach((e)=>e.parent.remove(e));
  list = [];
}

function initWS() {
  socket.on('stb:loadFromDatabase', async function (geometryElements) {
    clear(roads);
    clear(buildings);
    console.log('loading')
    
    for(let e of geometryElements) {
      let points = gf.coordinatesToPoints(e.coordinates, e.size);
      if(e.closed) {
        let building = gf.Segments(points, e.closed, 0xaaaaaa, true);
        building.material = mt.Doubled(0xaaaaaa);
        setPolygonOffsetMaterial(building.material)
        buildings.push(building);
      } else {
        roads.push(gf.Segments(points, e.closed));
      }
    }
  });
}

function initScene() {
  
  
  gf = new ARCH.GeometryFactory(scene);
  mt = new ARCH.MaterialFactory();
  
  socket.emit('bts:initFromDatabase', {properties: {range:[16.38, 48.21, 16.42, 48.23]}})
  
}

function main() {
  const size = document.getElementById('container').clientWidth;
  
  const viewport = new ARCH.Viewport(size, size);
  renderer = viewport.renderer;
  
  scene = viewport.scene;
  
  camera = viewport.to2D();
  
  am = viewport.enableAssetManager();
  viewport.disableGUI();
  
  initWS();
  initScene();
  
}

export {
  main
}

/* eslint-disable no-unused-vars,no-case-declarations */
"use strict";
import * as THREE from 'three'
import * as ARCH from "@/archiweb"
import * as PriorityQueue from "priorityqueuejs"

let renderer, scene, gui, camera, mouse;

const xoy = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const raycaster = new THREE.Raycaster();

const balls = [];
let segs = [], bg;

let gf, am, tr, mt;

const param = {
  changing: false,
  color: 0xdddddd,
  size: 10
}

function initGUI() {
  gui.gui.add(param, 'size', 10, 50).listen().onChange(() => {
    if (currentObj) {
      currentObj.scale.x = param.size;
      currentObj.scale.y = param.size;
    }
  })
  gui.gui.addColor(param, 'color').listen().onChange(() => {
    if (currentObj)
      currentObj.material.color = new THREE.Color(param.color);
  });
  gui.gui.add(param, 'changing').name('keep changing');
}

function initScene() {
  scene.background = new THREE.Color(0xfafafa);
  const light = new THREE.SpotLight(0xffffff, 1.5);
  light.position.set(0, 0, 1000);
  scene.add(light);
  
  
  gf = new ARCH.GeometryFactory(scene);
  mt = new ARCH.MaterialFactory();
  
  
  let points = [
    [-110, 460, 0],
    [50, 500, 0],
    [240, 410, 0],
    [520, 640, 0],
    [320, 940, 0],
    [-190, 730, 0]
  ]
  // points = points.reverse();
  points.forEach((p) => balls.push(gf.Cylinder(p, [10, 10], mt.Flat(0xff0000), true)));
  bg = gf.Cuboid();
  bg.visible = false;
  balls.forEach((c) => c.parent = bg);
  
  spanningTree(balls.map((c) => c.position));
  
  am.refreshSelection(scene);
  am.addSelection(balls, 1);
  am.setCurrentID(1);
  
}

let currentObj = undefined;

function spanningTree(positions) {
  const pq = new PriorityQueue(function (a, b) {
    return b.dist - a.dist;
  });
  const mn = new Array(positions.length).fill(0x3f3f3f3f);
  const vis = new Array(positions.length).fill(0);
  mn[0] = 0;
  pq.enq({dist: 0, node: 0})
  const edge = []
  while (pq.size() > 0) {
    let p = pq.deq();
    let u = p.node;
    if (vis[u] === 0 && p._from !== undefined) {
      edge.push({u: p._from, v: u, dist: p.dist});
    }
    vis[u] = 1;
    for (let v = 0; v < positions.length; ++v) {
      if (v === u) continue;
      let w = positions[u].distanceTo(positions[v]);
      if (mn[v] > w) {
        mn[v] = w;
        pq.enq({dist: w, node: v, _from: u});
      }
    }
  }
  segs.forEach((e) => e.parent.remove(e));
  segs = [];
  for (let e of edge) {
    segs.push(
      gf.Segments([positions[e.u], positions[e.v]])
    )
  }
}

function objectChanged(o) {
  currentObj = o;
  am.highlightCurrent();
  if (o && !o.isGroup) {
    param.color = o.material.color.getHex();
    param.size = o.scale.x;
  }
}

function draggingChanged(o, event) {
  if (!event && balls.includes(o)) {
    spanningTree(balls.map((c) => c.position));
  }
}

function deleteChanged(o) {
  console.log('delete changed')
  let index = balls.indexOf(o);
  if (index > -1) {
    balls.splice(index, 1);
    spanningTree(balls.map((c) => c.position));
  }
}

function updateObject(uuid, model) {
  const o = scene.getObjectByProperty('uuid', uuid);
  o.updateModel(o, model);
  spanningTree(balls.map((c) => c.position))
}

function addMouseEvent() {
  renderer.domElement.addEventListener('mousemove', onMove, false);
  
  function onMove(event) {
    mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    )
  }
}

function addSphere() {
  raycaster.setFromCamera(mouse, camera);
  let p = raycaster.ray.intersectPlane(xoy, new THREE.Vector3());
  let b = gf.Cylinder([p.x, p.y, 0], [10, 10], mt.Flat(0xff0000), true);
  b.parent = bg;
  balls.push(b);
  spanningTree(balls.map((c) => c.position));
  
  am.addSelection([b], 1);
  am.refreshSelection(scene);
}


function addKeyEvent() {
  renderer.domElement.addEventListener('keydown', onDocumentKeyDown, false);
  renderer.domElement.addEventListener('keyup', onDocumentKeyUp, false);
  
  function onDocumentKeyDown(event) {
    switch (event.keyCode) {
      case 65:
        addSphere();
        console.log('a down')
      
    }
  }
  
  function onDocumentKeyUp(event) {
    switch (event.keyCode) {
      case 65:
        console.log('a up')
    }
  }
}

function draw() {
  if (param.changing && bg.dragging) {
    spanningTree(balls.map((c) => c.position));
  }
}

function main() {
  const viewport = new ARCH.Viewport();
  scene = viewport.scene;
  renderer = viewport.renderer;
  gui = viewport.gui;
  camera = viewport.to2D();
  
  viewport.draw = draw;
  
  am = viewport.enableAssetManager();
  tr = viewport.enableTransformer();
  tr.control.showZ = false;
  tr.objectChanged = objectChanged;
  tr.draggingChanged = draggingChanged;
  tr.deleteChanged = deleteChanged;
  
  
  initScene();
  
  initGUI();
  addKeyEvent();
  addMouseEvent();
}

export {
  main,
  updateObject
}

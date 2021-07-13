import * as THREE from "three";
import * as ARCH from "@/archiweb"
import {token} from "@/sensitiveInfo"

let scene, gui;
let gf, mf;
let lastRandom = 1;
let lines = [];

function random(seed) {
  seed = seed || lastRandom;
  return lastRandom = ('0.' + Math.sin(seed).toString().substr(6));
}

/* ---------- GUI setup ---------- */
const control = {
  seed: 1,
  num: 10,
  nx: 500,
  ny: 300,
}

const property = {
  d: 1,
}


function initArchiJSON() {
  let archijson = new ARCH.ArchiJSON(token);
  
  // set send button
  control.sendToJava = function () {
    archijson.sendArchiJSON('java-backend', window.objects, property);
  }
  
  archijson.onSetup = function () {
    control.sendToJava();
  }
  
  archijson.onReceive = function (archijson) {
    lines.forEach((line) => {
      line.parent.remove(line);
    })
    lines = [];
    for (let e of archijson.geometryElements) {
      const line = gf.Segments();
      line.geometry.setAttribute('position', new THREE.Float32BufferAttribute(e.coordinates, e.size));
      lines.push(line);
    }
  }
}


function initGUI() {
  
  gui.add(control, 'seed', 0, 1).onChange(() => {
    update()
  });
  gui.add(control, 'num', 5, 1000, 1).onChange(() => {
    update()
  });
  gui.add(control, 'nx', 100, 1000, 1).onChange(() => {
    update()
  });
  gui.add(control, 'ny', 100, 1000, 1).onChange(() => {
    update()
  });
  gui.add(property, 'd', 0.5, 20).onChange(() => {
    control.sendToJava();
  });
  gui.add(control, 'sendToJava').name('Send Geometries');
}


/* ---------- create your scene object ---------- */
let positions, colors, points, border;

function initScene() {
  scene.background = new THREE.Color('#ffffff');
  
  gf = new ARCH.GeometryFactory(scene);
  mf = new ARCH.MaterialFactory();
  //
  
  points = gf.Vertices();
  points.material = new THREE.PointsMaterial({size: 10, vertexColors: true})
  generatePoints(control.num, control.nx, control.ny);
  
  
  border = gf.Plane([0, 0, 0], [control.nx, control.ny, 0.5],
    mf.Void(), true);
  
  
  // refresh global objects
  ARCH.refreshSelection(scene);
  
  
}


function generatePoints(num, nx, ny) {
  positions = [];
  colors = [];
  random(control.seed);
  for (let i = 0; i < num; ++i) {
    const x = random() * nx - nx / 2;
    const y = random() * ny - ny / 2;
    positions.push(x, y, 0);
    colors.push(x / nx + 0.5, y / ny + 0.5, -x / nx + 0.5);
  }
  
  points.size = num;
  points.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  points.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  points.geometry.computeBoundingSphere();
}

function update() {
  generatePoints(control.num, control.nx, control.ny);
  border.scale.x = control.nx;
  border.scale.y = control.ny;
  
  control.sendToJava();
}

/* ---------- main entry ---------- */
function main() {
  const viewport = new ARCH.Viewport();
  scene = viewport.scene;
  gui = viewport.gui.gui;
  
  viewport.setCameraPosition([300, -400, 300], [0, 0, 0])
  initArchiJSON();
  initGUI();
  initScene();
}

export {
  main
}
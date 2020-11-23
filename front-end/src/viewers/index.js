/* eslint-disable no-unused-vars,no-case-declarations */
"use strict";
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {DragControls} from "three/examples/jsm/controls/DragControls";

/**
 *      ___           ___           ___           ___                       ___           ___           ___
 *     /\  \         /\  \         /\  \         /\__\          ___        /\__\         /\  \         /\  \
 *    /::\  \       /::\  \       /::\  \       /:/  /         /\  \      /:/ _/_       /::\  \       /::\  \
 *   /:/\:\  \     /:/\:\  \     /:/\:\  \     /:/__/          \:\  \    /:/ /\__\     /:/\:\  \     /:/\:\  \
 *  /::\~\:\  \   /::\~\:\  \   /:/  \:\  \   /::\  \ ___      /::\__\  /:/ /:/ _/_   /::\~\:\  \   /::\~\:\__\
 * /:/\:\ \:\__\ /:/\:\ \:\__\ /:/__/ \:\__\ /:/\:\  /\__\  __/:/\/__/ /:/_/:/ /\__\ /:/\:\ \:\__\ /:/\:\ \:|__|
 * \/__\:\/:/  / \/_|::\/:/  / \:\  \  \/__/ \/__\:\/:/  / /\/:/  /    \:\/:/ /:/  / \:\~\:\ \/__/ \:\~\:\/:/  /
 *      \::/  /     |:|::/  /   \:\  \            \::/  /  \::/__/      \::/_/:/  /   \:\ \:\__\    \:\ \::/  /
 *      /:/  /      |:|\/__/     \:\  \           /:/  /    \:\__\       \:\/:/  /     \:\ \/__/     \:\/:/  /
 *     /:/  /       |:|  |        \:\__\         /:/  /      \/__/        \::/  /       \:\__\        \::/__/
 *     \/__/         \|__|         \/__/         \/__/                     \/__/         \/__/         ~~
 *
 *
 *
 * Copyright (c) 2020-present, Inst.AAA.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Date: 2020-11-12
 */
import {DragFrames} from "@/viewers/DragFrames";
import {SceneBasic} from "@/viewers/SceneBasic";
import {Transformer} from "@/viewers/Transformer";
import {MultiCamera} from "@/viewers/MultiCamera";
import {GeometryBasic} from "@/viewers/GeometryBasic";
import {Loader} from "@/viewers/Loader";

const gui = require('@/viewers/gui')

let renderer, scene;
let orbit;
let gb;
let sceneBasic, transformer, loader;
let multiCamera;

let camera, drag;
let InfoCard;

let objects = [];
let D3 = false;

let pos=[[-10, 30], [0, 10], [30, -10], [40, -30], [50, -50]];
let curveObject, leftCurve, rightCurve;

function initRender() {
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  renderer.autoClear = false;
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  addToDOM();
}

function initScene2D() {
  scene = new THREE.Scene();
  
  let controls = {
    color: 0xfafafa
  };
  scene.background = new THREE.Color(controls.color);
  gui.gui.addColor(controls, 'color').onChange(function() {
    scene.background = new THREE.Color(controls.color);
  });
  
  renderer.autoClear = true;
  
  const light = new THREE.SpotLight( 0xffffff, 1.5 );
  light.position.set(0,0,1000);
  scene.add(light);
  
  const circle = new THREE.CircleGeometry(1, 100);
  
  for(let p of pos) {
    const mesh = new THREE.Mesh(circle, new THREE.MeshLambertMaterial({color:0xff0000}))
    console.log(p);
    mesh.position.set(p[0], p[1], 0);
    
    objects.push(mesh);
    scene.add(mesh);
  }
  
  drawSplineLine();
}

function drawSplineLine() {
  scene.remove(curveObject);
  let positions = [];
  for(let obj of objects) {
    let p = obj.position.clone();
    p.z = -1;
    positions.push(p);
  }
  const curve = new THREE.CatmullRomCurve3(positions);
  const points = curve.getPoints( 50 );
  const geometry = new THREE.BufferGeometry().setFromPoints( points );
  const material = new THREE.LineBasicMaterial( { color : 0x000000 } );

// Create the final object to add to the scene
  curveObject = new THREE.Line( geometry, material );
  scene.add(curveObject);
  drawOffsetSplineLine(curve)
}

function drawOffsetSplineLine(curve) {
  scene.remove(leftCurve);
  scene.remove(rightCurve);
  let left = [];
  let right = [];
  for(let t = 0.0; t <= 1.0; t += 0.02) {
    let point = curve.getPointAt(t);
    
    let tangent = curve.getTangentAt(t);
    let extension1 = new THREE.Vector3(tangent.x*2, tangent.y*2, 0);
    let extension2 = new THREE.Vector3(-tangent.x*2, -tangent.y*2, 0);

    let tangentGeometry = new THREE.BufferGeometry().setFromPoints( [extension2, tangent, extension1] );
    let tangentLine = new THREE.Line(tangentGeometry, new THREE.LineBasicMaterial({color:0xff000}))
    tangentLine.position.copy(point);
    tangentLine.rotateZ(Math.PI/2);
    // scene.add(tangentLine);
  
    tangentLine.updateMatrixWorld(true);
    let normal = tangentLine.geometry.clone();
    normal.applyMatrix4(tangentLine.matrix);
    
    let position = normal.attributes.position;
    left.push(new THREE.Vector3(position.getX(0), position.getY(0), 0));
    right.push(new THREE.Vector3(position.getX(2), position.getY(2), 0));
    
  }
  
  const material = new THREE.LineBasicMaterial( { color : 0x000000 } );
  let cv = new THREE.CatmullRomCurve3(left);
  let points = cv.getPoints( 50 );
  let geometry = new THREE.BufferGeometry().setFromPoints( points );
  
  leftCurve = new THREE.Line( geometry, material );
  
  cv = new THREE.CatmullRomCurve3(right);
  points = cv.getPoints( 50 );
  geometry = new THREE.BufferGeometry().setFromPoints( points );
  rightCurve = new THREE.Line(geometry, material);
  
  scene.add(leftCurve);
  scene.add(rightCurve);
}

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfafafa);
  
  gb = new GeometryBasic(scene, objects);
  

  const b1 = gb.Box([150, 150, 0], [300, 300, 300], new THREE.MeshLambertMaterial( { color : 0xdddddd } ));
  
  gb.Box([-300, -300, 0], [300, 300, 100], new THREE.MeshLambertMaterial( { color : 0xdddddd } ));
  
  gb.Box([300, -500, 0], [300, 300, 150], new THREE.MeshLambertMaterial( { color : 0xdddddd } ));
  
  console.log(gb.modelParam(b1));
  
  loader = new Loader(scene, objects);

  loader.loadModel('/models/spruce-tree.dae', (mesh) => {
    mesh.position.set(0, -300, 0);
    gb.setMeshMaterial(mesh, new THREE.MeshLambertMaterial({color: 0x5a824e, transparent:true, opacity:0.6}) )
    mesh.toCamera = true;
    // toCamera.push(mesh);

    // console.log(mesh);
  });

  loader.loadModel('/models/autumn-tree.dae', (mesh) => {
    mesh.position.set(500, 0, 0);
    mesh.scale.set(2, 2, 2);
    gb.setMaterialOpacity(mesh, 0.6);
    mesh.toCamera = true;
    // console.log(mesh);
  });
  
  for(let o of objects) {
    console.log(o)
  }

}





function initDrag() {
  if(D3) {
    drag = new DragFrames(objects, camera, scene, renderer);
    drag.enabled = true;
  
    drag.addEventListener('selectdown', function () {
      transformer.clear();
    });
  
    drag.addEventListener('select', function (event) {
      for (let i = 0; i < event.object.length; ++i) {
        let materials = event.object[i].material;
        if (materials.length) {
          for (let j = 0; j < materials.length; ++j) {
            materials[j].emissive.set(0x666600);
          }
        } else {
          materials.emissive.set(0x666600);
        }
        if (event.object[i].children.length > 0) {
          event.object[i].children[0].visible = true;
        }
        if (event.object[i].children.length > 1) {
          event.object[i].children[1].visible = false;
        }
      }
    });
  
    drag.addEventListener('selectup', function (event) {
      for (let i = 0; i < event.object.length; ++i) {
        let materials = event.object[i].material;
        if (materials.length) {
          for (let j = 0; j < materials.length; ++j) {
            materials[j].emissive.set(0x000000);
          }
        } else {
          materials.emissive.set(0x000000);
        }
        if (event.object[i].children.length > 0) {
          event.object[i].children[0].visible = false;
        }
        if (event.object[i].children.length > 1) {
          event.object[i].children[1].visible = true;
        }
      }
      transformer.setSelected(event.object);
    });
  } else {
    drag = new DragControls(objects, camera, renderer.domElement);
    drag.addEventListener( 'hoveron', function (event) {
      // console.log(event.object);
      // console.log(InfoCard)
      let o = event.object;
      InfoCard.info.uuid = o.uuid;
      InfoCard.info.position = o.position.clone();
      InfoCard.info.model = {};
      InfoCard.info.properties = {title:"some point", position: JSON.stringify(o.position)};
      orbit.enabled = false;
    } );
    drag.addEventListener( 'hoveroff', function () {
      orbit.enabled = true;
    } );
    drag.addEventListener('dragend', function(event) {
      
      let o = event.object;
      
      o.position.x = Math.round(o.position.x);
      o.position.y = Math.round(o.position.y);
      o.position.z = Math.round(o.position.z);
      InfoCard.info.uuid = o.uuid;
      InfoCard.info.position = o.position;

      InfoCard.info.properties = {title:"some point", position: JSON.stringify(o.position)};
      drawSplineLine();
    });
    drag.addEventListener('drag', function() {
      drawSplineLine();
    })
  }
}


function initControls() {
  if(orbit !== undefined) orbit.dispose();
  orbit = new OrbitControls(camera, renderer.domElement);
  initDrag();
  
  if(D3) {
    orbit.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      RIGHT: THREE.MOUSE.ROTATE
    }
    orbit.enablePan = false;
    multiCamera.addControllers(orbit);
    transformer = new Transformer(scene, renderer, camera, objects, drag);
    transformer.addGUI(gui.gui);
    multiCamera.addControllers(transformer);
  } else {

    orbit.enableRotate = false;

  }
  
}

function windowResize(w, h) {
  
  if(D3) {
    multiCamera.onWindowResize(w, h);
    drag.onWindowResize(w, h);
  } else {
    camera.left = camera.bottom * w/h;
    camera.right = camera.top * w/h;
    camera.updateProjectionMatrix();
  }
  renderer.setSize(w, h);
  
  render();
}



function render() {
  
  // console.log(multiCamera.camera);
  scene.traverse((obj) => {
    if(obj.toCamera) {
      // console.log(obj)
      let dx = camera.position.x - obj.position.x;
      let dy = camera.position.y - obj.position.y;
      let theta = -Math.atan2(dx, dy);
  
      obj.quaternion.set(0, 0, 0, 1);
      obj.rotateZ(theta);
      // console.log(dx, dy)
    }
  });

  if(D3) {
    renderer.clear();
    renderer.render(scene, camera);
    drag.render();
  } else {
    renderer.render(scene, camera);
  }
}


function animate() {
  requestAnimationFrame(animate);
  render();
}


function onDocumentKeyDown(event) {
  switch (event.keyCode) {
    case 16: // Shift
      if(D3) {
        orbit.enablePan = true;
      } else {
        orbit.enabled = false;
      }
      break;
    case 73:
      window.InfoCard.hideInfoCard(!window.InfoCard.show);
  
  }
}

function onDocumentKeyUp(event) {
  switch (event.keyCode) {
    
    case 16: // Shift
      if(D3) {
        orbit.enablePan = false;
      } else {
        orbit.enabled = true;
      }

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


function updateObjectPosition(uuid, position, model) {
  const o = scene.getObjectByProperty('uuid', uuid);
  // o.position.copy(position);
  if(D3) {
    gb.updateModel(o, model);
  } else {
    drawSplineLine();
  }
}

function scene3D() {
  D3 = true;
  objects = [];
  gui.initGUI();
  
  initRender();
  initScene();
  
  multiCamera = new MultiCamera(scene, renderer);
  multiCamera.addGUI(gui.gui);
  camera = multiCamera.camera;
  initControls();
  
  sceneBasic = new SceneBasic(scene, renderer);
  sceneBasic.addGUI(gui.gui);
}

function scene2D() {
  D3 = false;
  objects = [];
  gui.initGUI();
  
  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.OrthographicCamera(-50 * aspect, 50 * aspect, 50, -50, 0.01, 30000);
  camera.position.set(0, 0, 1000);
  
  initScene2D();
  initControls();
}


function main() {
  initRender();
  if (D3) {
    scene3D();
  } else {
    scene2D();
  }
  animate();
  InfoCard = window.InfoCard;
}

export {
  main,
  scene2D,
  scene3D,
  loader,
  D3,
  updateObjectPosition,
}

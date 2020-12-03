/* eslint-disable no-unused-vars,no-case-declarations */
"use strict";

import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.121.1/examples/jsm/controls/OrbitControls.js';
import {LineMaterial} from "https://unpkg.com/three@0.121.1/examples/jsm/lines/LineMaterial";
import {WireframeGeometry2} from "https://unpkg.com/three@0.121.1/examples/jsm/lines/WireframeGeometry2";
import {Wireframe} from "https://unpkg.com/three@0.121.1/examples/jsm/lines/Wireframe";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.set(2, 3, 4);

// renderer
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

renderer.setSize( window.innerWidth, window.innerHeight );
const container = document.getElementById('container');
const canvas = container.getElementsByTagName('canvas');
if (canvas.length > 0) {
  container.removeChild(canvas[0]);
}
container.appendChild(renderer.domElement);
window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
};

renderer.domElement.addEventListener('click', function(event){
  event.preventDefault();
  
  console.log(camera);
  console.log(light);
  console.log(controls);
},false);

// ambient
scene.add( new THREE.AmbientLight( 0xeeeeee ) );

// direct light
const light = new THREE.DirectionalLight(0xffffff);
scene.add( light );

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// controls
const controls = new OrbitControls( camera, renderer.domElement );


const group = new THREE.Group();
scene.add(group);
// geometry
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial( { color: 0xdddd00 } );
const cube = new THREE.Mesh( geometry, material );
lineMesh(cube);

const cube2 = new THREE.Mesh(geometry, material);
lineMesh(cube2);
cube2.position.set(-3, 0, -3);

group.add(cube);
group.add(cube2);

applyGroupCenter(group);

function applyGroupCenter(group) {
  let box = new THREE.Box3().setFromObject(group);
  let bh = new THREE.Box3Helper(box);
  
  scene.add(bh);
  let c = new THREE.Vector3();
  box.getCenter(c);
  group.translateX(c.x);
  group.translateY(c.y);
  
  group.children.forEach((item)=>{
    item.position.x -= c.x;
    item.position.y -= c.y;
  });
}


function lineMesh (mesh) {
  
  mesh.material.polygonOffset = true;
  mesh.material.polygonOffsetFactor = 1.0;
  mesh.material.polygonOffsetUnits = 1.0;
  
  const lineMaterial =  new THREE.LineBasicMaterial( { color: 0x000000} );
  const edges = new THREE.EdgesGeometry(mesh.geometry);
  const line = new THREE.LineSegments(edges, lineMaterial);
  
  mesh.add(line);
}


// animated
function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
  
  let pos = camera.position.clone();
  pos.x -= 1;
  pos.y += 2;
  pos.z -= 0.5;
  light.position.copy(pos);
  light.target.position.copy(controls.target);
  
}
animate();

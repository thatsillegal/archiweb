/* eslint-disable no-unused-vars,no-case-declarations */
"use strict";

import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.121.1/examples/jsm/controls/OrbitControls.js';
import {LineMaterial} from "https://unpkg.com/three@0.121.1/examples/jsm/lines/LineMaterial";
import {WireframeGeometry2} from "https://unpkg.com/three@0.121.1/examples/jsm/lines/WireframeGeometry2";
import {Wireframe} from "https://unpkg.com/three@0.121.1/examples/jsm/lines/Wireframe";

const info = document.getElementById( 'meta-info' );
info.style.position = 'absolute';
info.style.top = '60px';
info.style.width = '100%';
info.style.textAlign = 'center';
info.style.color = '#bbaaaa';
info.style.fontWeight = 'bold';
info.style.backgroundColor = 'transparent';
info.style.zIndex = '1';
info.style.fontFamily = 'Monospace';
info.innerHTML = 'Line<br/>drag mouse to rotate camera';
document.body.appendChild( info );

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


// controls
const controls = new OrbitControls( camera, renderer.domElement );


// geometry
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial( { color: 0xdddd00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );


const test = {
  verts: [
    [ 1055.5488810559277, 223.62985233130985, 0 ],
    [ 950.220444680404, -174.9498006713706, 100 ],
    [ 755.5488810559278, 300, 300 ],
    [ 755.5488810559278, 0, 100 ],
    [ 873.5331585297903, 0, 100 ],
    [ 1055.5488810559277, 300, 300 ],
    [ 1055.5488810559277, 300, 0 ],
    [ 873.5331585297903, -76.37014766869015, 100 ],
    [ 950.220444680404, -76.37014766869015, 100 ],
    [ 650.220444680404, 125.05019932862939, 0 ],
    [ 755.5488810559278, 0, 300 ],
    [ 1173.5331585297904, 223.62985233130985, 150 ],
    [ 1055.5488810559277, 223.62985233130985, 150 ],
    [ 755.5488810559278, 125.05019932862939, 0 ],
    [ 1173.5331585297904, -76.37014766869015, 0 ],
    [ 755.5488810559278, 300, 0 ],
    [ 950.220444680404, -76.37014766869015, 0 ],
    [ 950.220444680404, -174.9498006713706, 0 ],
    [ 650.220444680404, -174.9498006713706, 0 ],
    [ 755.5488810559278, 125.05019932862939, 100 ],
    [ 650.220444680404, 125.05019932862939, 100 ],
    [ 1173.5331585297904, 223.62985233130985, 0 ],
    [ 650.220444680404, -174.9498006713706, 100 ],
    [ 1173.5331585297904, -76.37014766869015, 150 ],
    [ 873.5331585297903, 0, 150 ],
    [ 873.5331585297903, -76.37014766869015, 150 ],
    [ 1055.5488810559277, 0, 150 ],
    [ 1055.5488810559277, 0, 300 ]
  ],
  faces: [
    [ 18, 16, 17 ], [ 20, 9, 18 ],  [ 2, 10, 27 ],
    [ 12, 11, 21 ], [ 19, 10, 2 ],  [ 20, 3, 19 ],
    [ 6, 12, 0 ],   [ 8, 14, 23 ],  [ 9, 20, 19 ],
    [ 22, 18, 17 ], [ 2, 5, 6 ],    [ 25, 26, 24 ],
    [ 14, 21, 11 ], [ 1, 17, 16 ],  [ 27, 24, 26 ],
    [ 24, 4, 7 ],   [ 18, 9, 13 ],  [ 13, 15, 0 ],
    [ 18, 13, 16 ], [ 0, 15, 6 ],   [ 21, 14, 0 ],
    [ 0, 14, 16 ],  [ 0, 16, 13 ],  [ 22, 20, 18 ],
    [ 5, 2, 27 ],   [ 0, 12, 21 ],  [ 3, 10, 19 ],
    [ 2, 15, 19 ],  [ 19, 15, 13 ], [ 22, 1, 7 ],
    [ 7, 1, 8 ],    [ 22, 7, 3 ],   [ 3, 7, 4 ],
    [ 20, 22, 3 ],  [ 5, 27, 12 ],  [ 12, 27, 26 ],
    [ 6, 5, 12 ],   [ 16, 14, 8 ],  [ 23, 25, 8 ],
    [ 8, 25, 7 ],   [ 13, 9, 19 ],  [ 1, 22, 17 ],
    [ 15, 2, 6 ],   [ 23, 11, 26 ], [ 26, 11, 12 ],
    [ 25, 23, 26 ], [ 23, 14, 11 ], [ 8, 1, 16 ],
    [ 10, 3, 24 ],  [ 24, 3, 4 ],   [ 10, 24, 27 ],
    [ 25, 24, 7 ]
  ],
  colors: [ '-1' ],
  col_FaceNum: [ 52 ]
}

parseGeometry(test);



function parseGeometry(archiJSON) {
  const geo = new THREE.Geometry();
  let flag = true;
  for(let i = 0; i < archiJSON.verts.length; ++ i) {
    const vt = archiJSON.verts[i];
    geo.vertices.push(new THREE.Vector3(vt[0], vt[1], vt[2]));
    flag &= true;
  }
  
  for(let i = 0; i < archiJSON.faces.length; ++ i) {
    const fs = archiJSON.faces[i];
    geo.faces.push(new THREE.Face3(fs[0], fs[1], fs[2]));
    flag &= true;
  }
  
  geo.computeBoundingBox();
  
  geo.computeFaceNormals();
  geo.normalsNeedUpdate = true;
  const material = new THREE.MeshLambertMaterial({color: 0xdddddd});
  material.polygonOffset = true;
  material.polygonOffsetFactor = 1.0;
  material.polygonOffsetUnits = 1.0;
  
  if(flag) {
    const mesh = new THREE.Mesh(geo, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    
    mesh.scale.set(0.003, 0.003, 0.003);
  
    const lineMaterial =  new THREE.LineBasicMaterial( { color: 0x000000
    } );
  
    console.log(lineMaterial)
    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(edges, lineMaterial);
    // fixZFighting(mesh, line);
   
    mesh.add(line);
    scene.add( mesh );
  }
  
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

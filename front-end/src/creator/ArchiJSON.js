import socket from "@/socket";
import * as THREE from 'three';
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import {WireframeGeometry2} from "three/examples/jsm/lines/WireframeGeometry2";
import {Wireframe} from "three/examples/jsm/lines/Wireframe";

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
 * Author: Yichen Mo
 */

const ArchiJSON = function (_scene) {
  let scope = this;
  
  this.sendToJava = function () {
    scope.sendArchiJSON('bts:sendGeometry', window.objects);
  }
  
  this.addGUI = function (gui) {
    let de = gui.addFolder('Data Exchange');
    de.open();
    de.add(scope, 'sendToJava').name('java');
  }
  
  this.sendArchiJSON = function (eventName, objects) {
    
    let geometries = [];
    for (let obj of objects) {
      if (obj.exchange) {
        geometries.push(obj.toArchiJSON());
      }
    }
    socket.emit(eventName, {archijson: geometries});
    console.log('emit' + eventName);
  }
  
  socket.on('stb:receiveGeometry', async function (message) {
    
    // get geometry
    parseGeometry(message);
    
  });
  
  
  function meshLine(geometry, color, linewidth) {
    const matLine = new LineMaterial({color: color, linewidth: linewidth});
    const geoLine = new WireframeGeometry2(geometry);
    const wireframe = new Wireframe(geoLine, matLine);
    wireframe.computeLineDistances();
    wireframe.scale.set(1, 1, 1);
    wireframe.renderOrder = 2;
    return wireframe;
  }
  
  
  function parseGeometry(archiJSON) {
    const geo = new THREE.Geometry();
    let flag = true;
    for (let i = 0; i < archiJSON.verts.length; ++i) {
      const vt = archiJSON.verts[i];
      geo.vertices.push(new THREE.Vector3(vt[0], vt[1], vt[2]));
      flag &= true;
    }
    
    for (let i = 0; i < archiJSON.faces.length; ++i) {
      const fs = archiJSON.faces[i];
      geo.faces.push(new THREE.Face3(fs[0], fs[1], fs[2]));
      flag &= true;
    }
    
    geo.computeBoundingBox();
    
    geo.computeFaceNormals();
    geo.normalsNeedUpdate = true;
    
    const material = new THREE.MeshLambertMaterial({color: 0xdddddd, flatShading: true});
    material.polygonOffset = true;
    material.polygonOffsetFactor = 1.0;
    material.polygonOffsetUnits = 1.0;
    
    if (flag) {
      const mesh = new THREE.Mesh(geo, material);
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      
      mesh.add(meshLine(mesh.geometry, 0xffff00, 0.005));
      
      const lineMaterial = new THREE.LineBasicMaterial({color: 0x000000, transparent: false, depthWrite: true});
      lineMaterial.polygonOffset = true;
      
      const edges = new THREE.EdgesGeometry(mesh.geometry);
      const line = new THREE.LineSegments(edges, lineMaterial);
      
      mesh.add(line);
      
      mesh.children[0].visible = false;
      
      window.objects.push(mesh);
      _scene.add(mesh)
    }
    
  }
  
  
}

export {
  ArchiJSON
}

import socket from "@/socket";
import * as THREE from 'three';
import {sceneAddMesh} from "@/creator/GeometryFactory";
import {refreshSelection} from "@/creator/AssetManager";


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

/**
 * You need to modify this file for specific usage
 * @param _scene
 * @constructor
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
    

    
    if (flag) {
      const material = new THREE.MeshLambertMaterial({color: 0xdddddd, flatShading: true});
      const mesh = new THREE.Mesh(geo, material);
      sceneAddMesh(_scene, mesh, true, true, [0, 1]);
      refreshSelection(_scene);
    }
    
  }
  
  
}

export {ArchiJSON};

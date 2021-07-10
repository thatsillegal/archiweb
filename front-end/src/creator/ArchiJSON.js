import socket from "@/socket";
import * as THREE from "three";


/**
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
const ArchiJSON = function (_scene, _geoFty) {
  let scope = this;
  let lines = [];
  this.socket = socket;
  
  this.sendArchiJSON = function (eventName, app, objects, properties = {}) {
    let geometries = [];
    for (let obj of objects) if (obj.exchange) {
      geometries.push(obj.toArchiJSON());
    }
    
    socket.emit(eventName, {app: app, geometryElements: geometries, properties: properties});
  }
  
  socket.on('connect', async function () {
    let key = "9d8b6db7-1a95-4747-ae96-b5641047794c";
    socket.key = key;
    socket.emit('register', {key: key, identity: 'client'}, response => {
      console.log(response);
    });
  
  })
  
  socket.on('stb:receiveGeometry', async function (message) {
    // get geometry
    scope.parseGeometry(message);
    
  });
  
  socket.on('receive', async function (message) {
    console.log(message)
  });
  
  
  this.parseGeometry = function (geometryElements) {
    lines.forEach((line) => {
      line.parent.remove(line);
    })
    lines = [];
    for (let e of geometryElements) {
      const line = _geoFty.Segments();
      line.geometry.setAttribute('position', new THREE.Float32BufferAttribute(e.coordinates, e.size));
      lines.push(line);
    }
  }
  
}

export {ArchiJSON};

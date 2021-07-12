import socket from "@/socket";
import * as THREE from "three";
import {token} from "@/sensitiveInfo"

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
 * @param _geoFty
 * @constructor
 */
const ArchiJSON = function (_scene, _geoFty) {
  let scope = this;
  this.socket = socket;
  this.lines = [];
  
  this.sendArchiJSON = function (identity, objects, properties = {}) {
    let geometries = [];
    for (let obj of objects) if (obj.exchange) {
      geometries.push(obj.toArchiJSON());
    }
    
    socket.emit('exchange', {to: identity, body: {geometryElements: geometries, properties: properties}}, response => {
      console.log(response);
      
    });
  }
  
  this.first = function () {
  
  }
  
  socket.on('connect', async function () {
    socket.token = token;
    socket.emit('register', {token: token, identity: 'client'}, response => {
      console.log(response);
      
      scope.first();
      
    });
    
  })

  
  socket.on('receive', async function (message) {
    // console.log(message.body.geometryElements)
    let archijson = JSON.parse(message.body);
  
    if (archijson['geometryElements'])
      scope.parseGeometry(archijson['geometryElements']);
  });
  
  
  this.parseGeometry = function (geometryElements) {
    scope.lines.forEach((line) => {
      line.parent.remove(line);
    })
    scope.lines = [];
    for (let e of geometryElements) {
      const line = _geoFty.Segments();
      line.geometry.setAttribute('position', new THREE.Float32BufferAttribute(e.coordinates, e.size));
      scope.lines.push(line);
    }
  }
  
}

export {ArchiJSON};

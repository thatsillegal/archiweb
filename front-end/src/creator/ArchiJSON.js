import {io} from 'socket.io-client'
import {uri} from '@/sensitiveInfo'
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
 * @constructor
 * @param token
 */
const ArchiJSON = function (token) {
  let scope = this;
  const socket = io(uri);
  socket.on('connect', async function () {
    socket.token = token;
    socket.emit('register', {token: token, identity: 'client'}, response => {
      if (window.DEBUG) console.log(response);
      scope.onSetup();
    });
    
  })
  
  
  socket.on('receive', async function (message) {
    // console.log(message.body.geometryElements)
    let archijson = typeof (message.body) === "string" ? JSON.parse(message.body) : message.body;
    scope.onReceive(archijson);
  });
  
  /**
   * Send ArchiJson
   * @param identity to which backend device, required
   * @param objects geometry elements, can be undefined
   * @param properties properties, can ve undefined
   */
  this.sendArchiJSON = function (identity, objects = {}, properties = {}) {
    let geometries = [];
    for (let obj of objects) if (obj.exchange) {
      geometries.push(obj.toArchiJSON());
    }
    socket.emit('exchange', {to: identity, body: {geometryElements: geometries, properties: properties}}, response => {
      if (window.DEBUG) console.log(response);
    });
  }
  
  
  this.socket = socket;
  this.onSetup = function () {
  }
  this.onReceive = function (body) {
    if (window.DEBUG) console.log(body);
  }
}

export {ArchiJSON};

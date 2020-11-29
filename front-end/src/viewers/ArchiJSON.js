import socket from "@/socket";
import * as THREE from 'three';

const ArchiJSON = function (_scene) {
  let scope = this;
  
  this.sendToJava = function() {
    scope.sendArchiJSON('bts:sendGeometry', window.objects);
  }
  
  this.addGUI = function(gui) {
    let de = gui.addFolder('Data Exchange');
    de.open();
    de.add(scope, 'sendToJava').name('java');
  }
  
  this.sendArchiJSON = function (eventName, objects) {
    
    let geometries = [];
    for(let obj of objects) {
      if(obj.exchange) {
        geometries.push(obj.toArchiJSON());
      }
    }
    socket.emit(eventName, {archijson: geometries});
    console.log('emit' + eventName);
  }
  
  socket.on('stb:receiveGeometry', async function(message){
    
    // get geometry
    parseGeometry(JSON.parse(message));
    
  });
  
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
    const material = new THREE.MeshBasicMaterial({color: 0xdddddd, side: THREE.DoubleSide});
  
    if(flag) {
      const mesh = new THREE.Mesh(geo, material);
      _scene.add( mesh )
    }

  }
}

export {
  ArchiJSON
}

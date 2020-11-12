"use strict";
import * as THREE from 'three';
import * as dat from 'dat.gui';
const index = require('@/viewers/3D/index')


let gui;
let position;

const controls = new function () {
  this.info = false;
  this.position = '0, 0, 0';
  this.import = function() {
    position = checkPosition(this.position);
    console.log('finish')
    if(position) {
      fileInput.click();
    }
  }
  let form = document.createElement( 'form' );
  form.style.display = 'none';
  document.body.appendChild( form );
  
  let fileInput = document.createElement( 'input' );
  fileInput.multiple = true;
  fileInput.type = 'file';
  fileInput.addEventListener( 'change', function () {
    index.loader.loadFile(fileInput.files[0], (mesh)=> {
      console.log(position);
      mesh.position.copy(position);
    });
    console.log(fileInput.files[0]);
    form.reset();
    
  } );
  form.appendChild( fileInput );
};

function initGUI() {
  gui = new dat.GUI({autoPlace: false});
  
  
  const util = gui.addFolder('Utils');
  util.add(controls, 'info').listen().onChange(() => {
      elementDisplay("info-card", controls.info);
    }
  );
  util.add(controls, 'position');
  util.add(controls, 'import');
  util.open();
  
  
  const container = document.getElementById('gui-container');
  container.appendChild(gui.domElement);
  
  elementDisplay("info-card", controls.info);
  
}

function checkPosition(str) {
  try {
    let v = str.split(", ");
    let vn = []
    v.forEach((i) => {
      if (isNaN(Number(i))) {
        throw Error('position not a number');
      } else {
        vn.push(Number(i));
      }
    });
    
    if (vn.length < 3)
      throw Error('length smaller than 3');
  
    return new THREE.Vector3(vn[0], vn[1], vn[2]);
  } catch (e) {
    alert(e);
  }
}

function elementDisplay(elementId, isShow) {
  let e = document.getElementById(elementId);
  e.style.display = isShow ? "block" : "none";
}

export {
  gui,
  initGUI
}

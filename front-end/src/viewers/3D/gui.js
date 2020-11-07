"use strict";
import * as dat from 'dat.gui';

const index = require('@/viewers/3D/index');

let gui;

const controls = new function () {
  this.info = false;
  this.mode = 'Perspective';
  this.control = 'Mouse';
};

function initGUI() {
  gui = new dat.GUI({autoPlace: false});
  

  const camera = gui.addFolder('Camera');
  camera.add(controls, 'control', ['WASD', 'Mouse']).onChange(
    function () {
      index.controlsUpdate(controls.control);
    }
  );
  camera.add(controls, 'mode', ['2D', 'Perspective', 'Parallel']);
  camera.open();
  
  const util = gui.addFolder('Utils');
  util.add(controls, 'info').listen().onChange(()=> {
      elementDisplay("info-card", controls.info);
    }
  );
  util.open();
  
  
  const container = document.getElementById('gui-container');
  container.appendChild(gui.domElement);
  
  elementDisplay("info-card", controls.info);
  
}

function elementDisplay(elementId, isShow) {
  let e = document.getElementById(elementId);
  e.style.display = isShow ? "block" : "none";
}

export {
  gui,
  initGUI
}

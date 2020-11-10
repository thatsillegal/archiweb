"use strict";
import * as dat from 'dat.gui';

let gui;

const controls = new function () {
  this.info = false;
  this.import = function() {
    fileInput.click();
  }
  let form = document.createElement( 'form' );
  form.style.display = 'none';
  document.body.appendChild( form );
  
  let fileInput = document.createElement( 'input' );
  fileInput.multiple = true;
  fileInput.type = 'file';
  fileInput.addEventListener( 'change', function () {
  
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
  util.add(controls, 'import');
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

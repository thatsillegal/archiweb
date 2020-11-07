// import * as THREE from 'three'
import {TransformControls} from "three/examples/jsm/controls/TransformControls";

const Transformer = function(_scene, _orbit, _renderer, _camera) {
  
  let control;
  let scope = this;
  
  //API
  
  function init() {
    control = new TransformControls( _camera, _renderer.domElement );
  
    control.addEventListener( 'dragging-changed', function ( event ) {
    
      _orbit.enabled = !event.value;
      scope.dragged = !event.value;
      let object = control.object;
      if(object !== undefined && object.isGroup) {
      
      
        object.matrixAutoUpdate = false;
      
        console.log(object.scale);
        console.log(object.children[0].scale);
      
        setChildQuaternion(object, object.quaternion);
        setChildPosition(object, object.position);
        setChildScale(object, object.scale);
      
        object.position.set(0,0,0);
        object.quaternion.set(0,0,0, 1);
        object.scale.set(1,1,1);
      
        console.log(object.scale);
        console.log(object.children[0].scale);
        object.updateMatrixWorld(true);
        object.matrixAutoUpdate = true;
      }
    } );
  
    _scene.add( control );
    _renderer.domElement.addEventListener('keydown', onDocumentKeyDown, false);
    
  }
  
  function setChildScale(object, scale) {
    if(!object.isGroup) {
      object.scale.multiply(scale);
      object.position.multiply(scale);
      object.updateMatrixWorld(true);
      return;
    }
    for(let i = 0; i < object.children.length; ++ i) {
      setChildScale(object.children[i], scale);
    }
  }
  
  
  function setChildPosition(object, position) {
    if(!object.isGroup) {
      // object.position.copy(position);
      object.position.add(position);
      object.updateMatrixWorld(true);
      return;
    }
    for(let i = 0; i < object.children.length; ++ i) {
      setChildPosition(object.children[i], position);
    }
  }
  
  function setChildQuaternion(object, quaternion) {
    if(!object.isGroup) {
      object.quaternion.premultiply(quaternion);
      object.position.applyQuaternion(quaternion);
      
      object.updateMatrixWorld(true);
      return;
    }
    for(let i = 0; i < object.children.length; ++ i) {
      setChildQuaternion(object.children[i], quaternion);
    }
  }
  
  
  function onDocumentKeyDown(event) {
    switch (event.keyCode) {
 
      case 81: // Q
        control.setSpace(control.space === "local" ? "world" : "local");
        break;
      
      
      
      case 87: // W
        control.setMode("translate");
        break;
      
      case 69: // E
        control.setMode("rotate");
        break;
      
      case 82: // R
        control.setMode("scale");
        break;
      
 
 
      case 187:
      case 107: // +, =, num+
        control.setSize(control.size + 0.1);
        break;
      
      case 189:
      case 109: // -, _, num-
        control.setSize(Math.max(control.size - 0.1, 0.1));
        break;
      
      
      case 32: // Spacebar
        control.enabled = !control.enabled;
        break;
      
    }
    
  }
  

  //
  // function addGUI(gui) {
  //   let transformer = gui.addFolder('Transformer');
  // }
  //
  init();
  this.control = control;
  this.dragged = false;
}

export {Transformer};
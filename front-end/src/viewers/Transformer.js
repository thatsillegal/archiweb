// import * as THREE from 'three'
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import * as THREE from "three";

const Transformer = function(_scene, _renderer, _camera, _objects, _dragFrames) {
  
  let control = null;
  let scope = this;
  let grouped;
  let selected = [];
  let dragged = false;
  
  //API
  
  function init() {
    control = new TransformControls( _camera, _renderer.domElement );
  
    control.addEventListener( 'dragging-changed', function ( event ) {
      
      dragged = !event.value;
    } );
  
    grouped = new THREE.Group();
    _scene.add(grouped);
  
    _scene.add( control );
    _renderer.domElement.addEventListener('keydown', onDocumentKeyDown, false);
    _renderer.domElement.addEventListener('click', onClick, false);
  }
  
  function onClick(event) {
    
    if(dragged) {
      dragged = !dragged;
      return;
    }
    
    const mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, control.camera );
    
    const intersections = raycaster.intersectObjects( _objects, true );
    

    applyTransformGroup();
  
    if(selected.length > 0) {
      attachObject(selected);
      selected = [];
    } else if ( intersections.length > 0 ) {
      attachObject([intersections[0].object]);
    } else {
      
      control.detach();
      if(_dragFrames !== undefined)
        _dragFrames.enabled = true;
    }
  }
  
  
  function attachObject(objs) {
    if(objs.length === 1) {
      control.attach(objs[0]);
      if(_dragFrames !== undefined)
        _dragFrames.enabled = false;
    } else if (objs.length > 1) {
      
      for(let i = 0; i < objs.length; ++ i) {
        grouped.add(objs[i]);
      }
      control.attach(grouped);
      
      if(_dragFrames !== undefined)
        _dragFrames.enabled = false;
    }
  }
  
  function applyTransformGroup() {
    let object = control.object;
    if(object !== undefined && object.isGroup) {
    
    
      object.matrixAutoUpdate = false;
    
      setChildQuaternion(object, object.quaternion);
      setChildPosition(object, object.position);
      setChildScale(object, object.scale);
    
      object.position.set(0,0,0);
      object.quaternion.set(0,0,0, 1);
      object.scale.set(1,1,1);
    
      object.updateMatrixWorld(true);
      object.matrixAutoUpdate = true;
    }
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
        if(control.space === 'local') {
          scope.world = true;
          control.setSpace('world');
        } else {
          scope.world = false;
          control.setSpace('local');
        }
        break;
      
      case 87: // W
        control.setMode("translate");
        scope.mode = 0;
        break;
      
      case 69: // E
        control.setMode("rotate");
        scope.mode = 1;
        break;
      
      case 82: // R
        control.setMode("scale");
        scope.mode = 2;
        break;
      
      case 187:
      case 107: // +, =, num+
        control.setSize(control.size + 0.1);
        break;
      
      case 189:
      case 109: // -, _, num-
        control.setSize(Math.max(control.size - 0.1, 0.1));
        break;
      
      case 32: // space bar
        applyTransformGroup();
        control.detach();
        break;
      
    }
    
  }
  
  

  function addGUI(gui) {
    let transformer = gui.addFolder('Transformer');
    transformer.open();
    
    transformer.add(scope, 'mode').min(0).max(2).step(1)
      .listen().onChange(function() {
        switch (scope.mode) {
          case 0:
            control.setMode("translate");
            break;
          case 1:
            control.setMode("rotate");
            break;
          case 2:
            control.setMode("scale");
            break;
        }
    });
    
    transformer.add(scope, 'world')
      .listen().onChange(function () {
        control.setSpace(scope.world === true ? "world" : "local");
    });
  }
  
  function setSelected(objects){
    selected = objects;
  }
  
  function setDragFrames(dragFrames) {
    _dragFrames = dragFrames;
  }
  
  function setCamera(camera) {
    control.camera = camera;
  }

  function clear() {
    for (let i = 0; i < grouped.children.length; ++ i) {
      _scene.attach(grouped.children[i]);
    }
  }
  
  init();
  this.mode = 0; // 0-transform, 1-rotate, 2-scale
  this.world = false; //true-word, false-local
  
  this.grouped = grouped;
  this.control = control;
  this.addGUI = addGUI;
  this.setSelected = setSelected;
  this.setDragFrames = setDragFrames;
  this.setCamera = setCamera;
  this.clear = clear;
}

export {Transformer};
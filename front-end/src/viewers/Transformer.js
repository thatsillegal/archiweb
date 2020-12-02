// import * as THREE from 'three'
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import * as THREE from "three";

const Transformer = function (_scene, _renderer, _camera, _dragFrames) {
  
  let control = null;
  let scope = this;
  let grouped;
  let selected = [];
  let dragged = false;
  let copy = false;
  //
  let clonedObject = [];
  let shiftDown;
  
  //API
  
  function addToInfoCard(o) {
    if(o !== undefined) {
      
      if(o.toInfoCard !== undefined) {
        o.toInfoCard();
        return;
      }
      o.position.x = Math.round(o.position.x);
      o.position.y = Math.round(o.position.y);
      o.position.z = Math.round(o.position.z);

      window.InfoCard.info.uuid = o.uuid;
      window.InfoCard.info.position = o.position;
      window.InfoCard.info.model = {};
      window.InfoCard.info.properties = {type:o.type, matrix:o.matrix.elements};
  
    }
  
  }
  
  function init() {
    control = new TransformControls(_camera, _renderer.domElement);
    control.addEventListener('object-changed', function(event) {
        addToInfoCard(event.value);
    });
    
    control.addEventListener('dragging-changed', function (event) {
      dragged = !event.value;
      
      if (event.value === true) {
        clonedObject = [];
        setCloneObject(control.object);
      } else {
        
        control.object.updateMatrix();
        addToInfoCard(control.object);
        
        if(copy) {
          addClonedObject(clonedObject);
          copy = false;
        }
      }
    });
    
    grouped = new THREE.Group();
    _scene.add(grouped);
    
    _scene.add(control);
    _renderer.domElement.addEventListener('keydown', onDocumentKeyDown, false);
    _renderer.domElement.addEventListener('keyup', onDocumentKeyUp, false);
    _renderer.domElement.addEventListener('click', onClick, false);
  }
  
  function setCloneObject(object) {
    if (!object.isGroup) {
      const cloned = object.clone();
      if(object.toCamera) cloned.toCamera = true;
      
      if(cloned.material.length > 0) {
        let materials = []
        for (let i = 0; i < cloned.material.length; ++ i) {
          materials.push(cloned.material[i].clone());
        }
        cloned.material = materials;
      } else {
        cloned.material = cloned.material.clone();
      }
      clonedObject.push(cloned);
    } else {
      for (let i = 0; i < object.children.length; ++i) {
        setCloneObject(object.children[i]);
      }
    }
  }
  
  function addClonedObject(object) {
    for (let i = 0; i < object.length; ++i) {
      _scene.add(object[i]);
      window.objects.push(object[i]);
    }
  }
  
  function onClick(event) {
  
    applyTransformGroup();
    
    if (dragged) {
      dragged = !dragged;
      return;
    }
    
    const mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, control.camera);
  

    const intersections = raycaster.intersectObjects(window.objects, false);
    
    
    if(shiftDown && intersections.length > 0) {
      if(control.object === undefined) {
        attachObject([intersections[0].object]);
      } else {
        if (control.object.isGroup) {
          control.object.add(intersections[0].object);
        } else {
          attachObject([control.object, intersections[0].object]);
        }
      }
      console.log(control.object)
    } else if (selected.length > 0) {
      attachObject(selected);
      selected = [];
    } else if (intersections.length > 0) {
      attachObject([intersections[0].object]);
    } else {
      
      control.detach();
      if (_dragFrames !== undefined)
        _dragFrames.enabled = true;
    }
  }
  
  
  function attachObject(objs) {
    if (objs.length === 1) {
      control.attach(objs[0]);
      if (_dragFrames !== undefined)
        _dragFrames.enabled = false;
    } else if (objs.length > 1) {
      let temp = new THREE.Group();
      
      for (let i = 0; i < objs.length; ++i) {
        temp.add(objs[i]);
      }
      
      let bbox = new THREE.Box3().setFromObject(temp);
      let bh = new THREE.Box3Helper(bbox);
  
      console.log(grouped.position);
      let c = new THREE.Vector3();
      bbox.getCenter(c);
      
      grouped.translateX(c.x);
      grouped.translateY(c.y);
  
      for (let i = 0; i < objs.length; ++i) {
        objs[i].position.x -= c.x;
        objs[i].position.y -= c.y;
        grouped.add(objs[i]);
      }
      
  
      console.log(grouped.position)
      _scene.add(bh);
      control.attach(grouped);
      
      if (_dragFrames !== undefined)
        _dragFrames.enabled = false;
    }
  }
  
  function deleteObject(object) {
    if (object === undefined) return;
    if (!object.isGroup) {
      console.log(object)
      _scene.remove(object);
    } else {
      for (let i = 0; i < object.children.length; ++i) {
        deleteObject(object.children[i]);
      }
    }
  }
  
  function applyTransformGroup() {
    let object = control.object;
    if (object !== undefined && object.isGroup) {
      
      
      object.matrixAutoUpdate = false;
      
      setChildQuaternion(object, object.quaternion);
      setChildPosition(object, object.position);
      setChildScale(object, object.scale);
      
      object.position.set(0, 0, 0);
      object.quaternion.set(0, 0, 0, 1);
      object.scale.set(1, 1, 1);
      
      object.updateMatrixWorld(true);
      object.matrixAutoUpdate = true;
    }
  }
  
  
  function setChildScale(object, scale) {
    if (!object.isGroup) {
      object.scale.multiply(scale);
      object.position.multiply(scale);
      object.updateMatrixWorld(true);
      return;
    }
    for (let i = 0; i < object.children.length; ++i) {
      setChildScale(object.children[i], scale);
    }
  }
  
  
  function setChildPosition(object, position) {
    if (!object.isGroup) {
      // object.position.copy(position);
      object.position.add(position);
      object.updateMatrixWorld(true);
      return;
    }
    for (let i = 0; i < object.children.length; ++i) {
      setChildPosition(object.children[i], position);
    }
  }
  
  function setChildQuaternion(object, quaternion) {
    if (!object.isGroup) {
      object.quaternion.premultiply(quaternion);
      object.position.applyQuaternion(quaternion);
      
      object.updateMatrixWorld(true);
      return;
    }
    for (let i = 0; i < object.children.length; ++i) {
      setChildQuaternion(object.children[i], quaternion);
    }
  }
  
  
  function onDocumentKeyDown(event) {
    let obj;
    switch (event.keyCode) {
      
      case 81: // Q
        if (scope.world === false) {
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
      
      case 83: // S
        if (scope.snap === true) {
          scope.snap = false;
          control.setTranslationSnap(null);
          control.setRotationSnap(null);
          control.setScaleSnap(null);
        } else {
          scope.snap = true;
          control.setTranslationSnap(scope.translateionSnap);
          control.setRotationSnap(THREE.MathUtils.degToRad(scope.rotationSnap));
          control.setScaleSnap(scope.scaleSnap);
        }
        break;
      
      case 187:
      case 107: // +, =, num+
        control.setSize(control.size + 0.1);
        break;
      
      case 189:
      case 109: // -, _, num-
        control.setSize(Math.max(control.size - 0.1, 0.1));
        break;
      
      case 18: // alt
        copy = !copy;
        break;
      
      case 32: // space bar
        applyTransformGroup();
        control.detach();
        break;
      
      case 46: // delete
        obj = control.object;
        deleteObject(control.object);
        control.detach();
        window.objects.splice(window.objects.findIndex(item=>item.uuid === obj.uuid), 1);
        break;
        
      case 16: // shift
        shiftDown = true;
    }
    
  }
  
  function onDocumentKeyUp(event) {
    switch (event.keyCode) {
      case 16: // shift
        shiftDown = false;
    }
  }
  
  function addGUI(gui) {
    let transformer = gui.addFolder('Transformer');
    transformer.open();
    
    transformer.add(scope, 'mode').min(0).max(2).step(1)
      .listen().onChange(function () {
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
    
    transformer.add(scope, 'snap')
      .listen().onChange(function () {
      if (scope.snap) {
        control.setTranslationSnap(null);
        control.setRotationSnap(null);
        control.setScaleSnap(null);
      } else {
        control.setTranslationSnap(scope.translateionSnap);
        control.setRotationSnap(THREE.MathUtils.degToRad(scope.rotationSnap));
        control.setScaleSnap(scope.scaleSnap);
      }
    });
  }

  function setSelected(objects) {
    selected = objects;
  }

  function setDragFrames(dragFrames) {
    _dragFrames = dragFrames;
  }
  
  function setCamera(camera) {
    control.camera = camera;
  }
  
  function clear() {
    for (let i = 0; i < grouped.children.length; ++i) {
      _scene.attach(grouped.children[i]);
    }
  }
  
  init();
  this.mode = 0; // 0-transform, 1-rotate, 2-scale
  this.world = false; //true-word, false-local
  this.snap = false;
  
  this.object = control.object;
  this.control = control;
  this.addGUI = addGUI;
  
  this.setSelected = setSelected;
  this.setDragFrames = setDragFrames;
  this.setCamera = setCamera;
  
  this.clear = clear;
  
  this.translateionSnap = 100;
  this.rotationSnap = 15;
  this.scaleSnap = 0.25;
  
  this.isTransformer = true;
  
}

export {Transformer};
/* eslint-disable no-unused-vars,no-case-declarations */
import * as THREE from 'three'

/**
 *      ___           ___           ___           ___                       ___           ___           ___
 *     /\  \         /\  \         /\  \         /\__\          ___        /\__\         /\  \         /\  \
 *    /::\  \       /::\  \       /::\  \       /:/  /         /\  \      /:/ _/_       /::\  \       /::\  \
 *   /:/\:\  \     /:/\:\  \     /:/\:\  \     /:/__/          \:\  \    /:/ /\__\     /:/\:\  \     /:/\:\  \
 *  /::\~\:\  \   /::\~\:\  \   /:/  \:\  \   /::\  \ ___      /::\__\  /:/ /:/ _/_   /::\~\:\  \   /::\~\:\__\
 * /:/\:\ \:\__\ /:/\:\ \:\__\ /:/__/ \:\__\ /:/\:\  /\__\  __/:/\/__/ /:/_/:/ /\__\ /:/\:\ \:\__\ /:/\:\ \:|__|
 * \/__\:\/:/  / \/_|::\/:/  / \:\  \  \/__/ \/__\:\/:/  / /\/:/  /    \:\/:/ /:/  / \:\~\:\ \/__/ \:\~\:\/:/  /
 *      \::/  /     |:|::/  /   \:\  \            \::/  /  \::/__/      \::/_/:/  /   \:\ \:\__\    \:\ \::/  /
 *      /:/  /      |:|\/__/     \:\  \           /:/  /    \:\__\       \:\/:/  /     \:\ \/__/     \:\/:/  /
 *     /:/  /       |:|  |        \:\__\         /:/  /      \/__/        \::/  /       \:\__\        \::/__/
 *     \/__/         \|__|         \/__/         \/__/                     \/__/         \/__/         ~~
 *
 *
 *
 * Copyright (c) 2020-present, Inst.AAA.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Date: 2020-11-12
 * Author: Yichen Mo
 */

const MultiCamera = function (_scene, _renderer) {
  this.width = window.innerWidth;
  this.height = window.innerHeight;
  
  let cameraPersp, cameraOrtho, currentCamera = null;
  let scope = this;
  let controllers = [];
  
  function init() {
    
    initPerspectiveCamera(scope.width, scope.height);
    initOrthographicCamera(scope.width, scope.height);
    
    currentCamera = cameraPersp;
    _renderer.domElement.addEventListener('keydown', onDocumentKeyDown, false);
    
  }
  
  function initOrthographicCamera(width, height) {
    let aspect = width / height;
    cameraOrtho = new THREE.OrthographicCamera(-600 * aspect, 600 * aspect, 600, -600, 1, 30000);
    cameraOrtho.position.set(1000, -1500, 1000);
    cameraOrtho.up = new THREE.Vector3(0, 0, 1);
  }
  
  function initPerspectiveCamera(width, height) {
    cameraPersp = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    cameraPersp.position.set(1000, -1500, 1000);
    cameraPersp.up = new THREE.Vector3(0, 0, 1);
  }
  
  function setCurrentCamera(control) {
    if (control.isTransformer) {
      control.setCamera(currentCamera);
    } else {
      control.object = currentCamera;
    }
  }
  
  function getTargetPosition() {
    for (let i = 0; i < controllers.length; ++i) {
      if (controllers[i].isTransformer === undefined)
        return controllers[i].target;
    }
  }
  
  
  function viewFrontLeft() {
    const position = getTargetPosition().clone();
    position.x -= 1200;
    position.y -= 1200;
    position.z += 1200;
    currentCamera.position.copy(position);
    
  }
  
  function viewFront() {
    const position = getTargetPosition().clone();
    position.y = -2000;
    currentCamera.position.copy(position);
  
  }
  
  function viewFrontRight() {
    const position = getTargetPosition().clone();
    position.x += 1200;
    position.y -= 1200;
    position.z += 1200;
    currentCamera.position.copy(position);
  
  }
  
  function viewLeft() {
    const position = getTargetPosition().clone();
    position.x = -2000;
    currentCamera.position.copy(position);
  }
  
  function viewUp() {
    const position = getTargetPosition().clone();
    position.z = 2000;
    currentCamera.position.copy(position);
  }
  
  function viewRight() {
    const position = getTargetPosition().clone();
    position.x = 2000;
    currentCamera.position.copy(position);
    
  }
  
  function viewBackLeft() {
    
    const position = getTargetPosition().clone();
    position.x -= 1200;
    position.y += 1200;
    position.z += 1200;
    currentCamera.position.copy(position);
  }
  
  function viewBack() {
    const position = getTargetPosition().clone();
    position.y = 2000;
    currentCamera.position.copy(position);
  }
  
  function viewBackRight() {
    const position = getTargetPosition().clone();
    position.x += 1200;
    position.y += 1200;
    position.z += 1200;
    currentCamera.position.copy(position);
    currentCamera.updateProjectionMatrix();
  
  }
  
  function onDocumentKeyDown(event) {
    switch (event.keyCode) {
      
      case 67: // C
        const position = currentCamera.position.clone();
        
        currentCamera = currentCamera.isPerspectiveCamera ? cameraOrtho : cameraPersp;
        currentCamera.position.copy(position);
        
        scope.camera = currentCamera;
        scope.isometric = !currentCamera.isPerspectiveCamera;
        
        controllers.forEach((control) => {
          setCurrentCamera(control)
        });
        
        break;
      case 86: // V
        const randomFoV = Math.random() + 0.1;
        const randomZoom = Math.random() + 0.1;
        
        cameraPersp.fov = randomFoV * 160;
        cameraOrtho.bottom = -randomFoV * 500;
        cameraOrtho.top = randomFoV * 500;
        
        cameraPersp.zoom = randomZoom * 5;
        cameraOrtho.zoom = randomZoom * 5;
        break;
      
      case 97:
      case 49: // 1
        viewFrontLeft();
        scope.view = 1;
        break;
      
      case 98:
      case 50: // 2
        viewFront();
        scope.view = 2;
        break;
      
      case 99:
      case 51: // 3
        viewFrontRight();
        scope.view = 3;
        break;
      
      case 100:
      case 52: // 4
        viewLeft();
        scope.view = 4;
        break;
      
      case 101:
      case 53: // 5
        viewUp();
        scope.view = 5;
        break;
      
      case 102:
      case 54: // 6
        viewRight();
        scope.view = 6;
        break;
      
      case 103:
      case 55: // 7
        viewBackLeft();
        scope.view = 7;
        break;
      
      case 104:
      case 56: // 8
        viewBack();
        scope.view = 8;
        break;
      
      case 105:
      case 57: // 9
        viewBackRight();
        scope.view = 9;
        break;
      
    }
    
  }
  
  
  init();
  
  this.view = 0;
  this.isometric = false;
  this.fov = 45;
  
  this.camera = currentCamera;
  this.onWindowResize = function (w, h) {
    cameraPersp.aspect = w / h;
    cameraPersp.updateProjectionMatrix();
    
    
    cameraOrtho.left = cameraOrtho.bottom * w / h;
    cameraOrtho.right = cameraOrtho.top * w / h;
    cameraOrtho.updateProjectionMatrix();
    
  };
  
  this.addControllers = function (control) {
    controllers.push(control);
  };
  
  this.addGUI = function (gui) {
    const camera = gui.addFolder("Camera");
    camera.add(scope, 'isometric')
      .listen().onChange(function () {
      const position = currentCamera.position.clone();
      
      currentCamera = currentCamera.isPerspectiveCamera ? cameraOrtho : cameraPersp;
      currentCamera.position.copy(position);
      
      scope.camera = currentCamera;
      
      controllers.forEach((control) => {
        setCurrentCamera(control)
      });
    });
    camera.add(scope, 'view', 0, 9, 1)
      .listen().onChange(function () {
      switch (scope.view) {
        case 1:
          viewFrontLeft();
          break;
        case 2:
          viewFront();
          break;
        case 3:
          viewFrontRight();
          break;
        case 4:
          viewLeft();
          break;
        case 5:
          viewUp();
          break;
        case 6:
          viewRight();
          break;
        case 7:
          viewBackLeft();
          break;
        case 8:
          viewBack();
          break;
        case 9:
          viewBackRight();
          break;
      }
    });
    camera.add(scope, 'fov', 0, 150, 1)
      .listen().onChange(function () {
      cameraPersp.fov = scope.fov;
      
      cameraOrtho.top = scope.fov * 600 / 45;
      cameraOrtho.bottom = -scope.fov * 600 / 45;
      
      currentCamera.updateProjectionMatrix();
    });
  }
  
  
};

export default MultiCamera;

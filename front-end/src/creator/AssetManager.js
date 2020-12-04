import * as THREE from 'three';

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

const AssetManager = function (_scene) {
  
  let scope = this;
  let max = 0;
  let transformerObject;
  let _gui = null;
  
  
  this.id = 0;
  this.group = new THREE.Group();
  _scene.add(scope.group);
  
  window.layer = scope.id;
  
  this.addSelectedItem = function (item, id) {
    if (item.layer === undefined) {
      item.layer = [id];
    } else if (!~item.layer.indexOf(id)) {
      item.layer.push(id);
    }
  }
  
  this.addSelection = function (lists, id = 0) {
    id = Number.parseInt(id);
    if (lists.length === undefined) {
      scope.addSelectedItem(lists, id);
    } else {
      lists.forEach((item) => {
        scope.addSelectedItem(item, id);
      });
    }
    
    max = Math.max(max, id);
    
    if (_gui) {
      _gui.__controllers.forEach((item) => {
        if (item.property === 'id') {
          item.__max = max;
          item.updateDisplay();
        }
      });
    }
  }
  
  this.refreshSelection = function () {
    window.objects = [];
    _scene.children.forEach((obj) => {
      if (obj.layer !== undefined && ~obj.layer.indexOf(window.layer)) {
        window.objects.push(obj);
      }
    })
    // console.log('current length', window.objects.length);
    
    window.highlightObject = window.objects;
  }
  
  this.setGroup = function () {
    console.log('trans', transformerObject)
    transformerObject.children.forEach((item) => {
      scope.group.add(item);
    });
  }
  
  this.highlightItem = function (item) {
    let materials = item.material;
    if (materials.length) {
      for (let j = 0; j < materials.length; ++j) {
        materials[j].emissive.set(0x666600);
      }
    } else {
      materials.emissive.set(0x666600);
    }
    
    if (item.children.length > 0) {
      item.children[0].visible = true;
    }
    if (item.children.length > 1) {
      item.children[1].visible = false;
    }
  }
  
  this.unHighlightItem = function (item) {
    let materials = item.material;
    if (materials.length) {
      for (let j = 0; j < materials.length; ++j) {
        materials[j].emissive.set(0x000000);
      }
    } else {
      materials.emissive.set(0x000000);
    }
    
    if (item.children.length > 0) {
      item.children[0].visible = false;
    }
    if (item.children.length > 1) {
      item.children[1].visible = true;
    }
  }
  
  this.highlightCurrent = function () {
    
    if (window.highlighted) {
      window.highlighted = false;
      window.highlightObject.forEach((item) => {
        scope.unHighlightItem(item);
      });
    } else {
      window.highlighted = true;
      window.highlightObject.forEach((item) => {
        scope.highlightItem(item);
      });
    }
  }
  
  this.setTransformerObject = function (obj) {
    transformerObject = obj;
  }
  
  this.addGUI = function (gui) {
    _gui = gui;
    gui.add(scope, 'setGroup').name('group');
    gui.add(scope, 'highlightCurrent').name('highlight');
    gui.add(scope, 'id', 0, max, 1).name('layer').listen().onChange(function () {
      window.layer = scope.id;
      scope.refreshSelection();
    });
  }
}

export {
  AssetManager
}
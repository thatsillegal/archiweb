import * as THREE from 'three';
const AssetManager = function (_scene) {
  
  let scope = this;
  let max = 0;
  let transformerObject;
  let _gui = null;

  
  this.id = 0;
  this.selection = [];
  this.currentSelect = [];
  this.group = new THREE.Group();
  _scene.add(scope.group);
  
  
  this.addSelection = function(lists) {
    if(lists.length === undefined) {
      scope.selection.push([lists]);
    } else {
      scope.selection.push(lists);
    }
    
    max ++;
  
    if(_gui) {
      _gui.__controllers.forEach((item) => {
        if (item.property === 'id') {
          item.__max = max - 1;
          item.updateDisplay();
        }
      });
    }
    
  }
  
  this.getSelection = function(id) {
    return scope.selection[id];
  };
  
  this.setGroup = function() {
    transformerObject.traverse((item) => {
      scope.group.add(item);
    });
  }
  
  this.setTransformerObject = function (obj){
    transformerObject = obj;
  }
  
  this.addGUI = function (gui) {
    _gui = gui;
    gui.add(scope, 'setGroup').name('group');
    gui.add(scope, 'id', 0, max, 1).listen().onChange(function () {
      window.objects = scope.selection[scope.id];
      console.log(window.objects.length);
    });
  }
}

export {
  AssetManager
}
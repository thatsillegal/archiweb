import * as THREE from 'three';
const AssetManager = function (_scene) {
  
  let scope = this;
  let max = 0;
  let transformerObject;
  let _gui = null;

  
  this.id = 0;
  this.group = new THREE.Group();
  _scene.add(scope.group);
  
  window.layer = scope.id;
  
  
  this.addSelection = function(lists, id = 0) {
    id = Number.parseInt(id);
    if(lists.length === undefined) {
      if(lists.layer === undefined) {
        lists.layer = [id];
      } else
        lists.layer.push(id);
    } else {
      lists.forEach((item)=>{
        if(item.layer === undefined) {
          item.layer = [id];
        } else {
          item.layer.push(id);
        }
      });
    }
    
    max = Math.max(max, id);
  
    if(_gui) {
      _gui.__controllers.forEach((item) => {
        if (item.property === 'id') {
          item.__max = max;
          item.updateDisplay();
        }
      });
    }
    
  }
  
  this.refreshSelection = function (){
    window.objects = [];
    _scene.children.forEach((obj) => {
      if(obj.layer !== undefined && ~obj.layer.indexOf(window.layer)) {
        window.objects.push(obj);
      }
    })
    console.log('current length', window.objects.length);
  }
  
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
    gui.add(scope, 'id', 0, max, 1).name('layer').listen().onChange(function () {
      window.layer = scope.id;
      scope.refreshSelection();
    });
  }
}

export {
  AssetManager
}
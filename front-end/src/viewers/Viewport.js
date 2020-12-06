import * as THREE from 'three';
import * as gui from '@/gui'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

import {AssetManager, MultiCamera} from "@/archiweb";
import {DragFrames} from "@/archiweb";
import {Transformer} from "@/archiweb";

const Viewport = function () {
  
  const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  const scene = new THREE.Scene();
  
  const camera = new MultiCamera(renderer.domElement);
  const controller = new OrbitControls(camera.camera, renderer.domElement);
  
  let drag;
  let transformer;
  let assetManager;
  
  function init() {
    window.objects = [];
  
    /* ---------- renderer ---------- */
    renderer.autoClear = false;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
  
    /* ---------- dom ---------- */
    addToDOM();
    
    /* ---------- gui ---------- */
    gui.initGUI();
  
    /* ---------- camera ---------- */
    camera.addGUI(gui.gui);
  
    /* ---------- orbit controller ---------- */
    controller.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      RIGHT: THREE.MOUSE.ROTATE
    }
    controller.enablePan = false;
    camera.setController(controller);
    
    animate();
  }
  
  function onSelectDown(event) {
    window.highlighted = true;
    assetManager.highlightList(event.object);
  }
  
  function onSelectUp(event) {
    window.highlighted = false;
    assetManager.unHighlightList(event.object);
    transformer.setSelected(event.object);
  }
  
  function enableAssetManager() {
    assetManager = new AssetManager(scene);
    assetManager.addGUI(gui.util);
  
    return assetManager;
  }
  
  function enableDragFrames() {
    if(assetManager === undefined) enableAssetManager();
  
    drag = new DragFrames(renderer, scene, camera.camera);
    
    drag.addEventListener('selectdown', () => {transformer.clear()});
    drag.addEventListener('select', onSelectDown);
    drag.addEventListener('selectup', onSelectUp);
    
    camera.setDrag(drag);
    
    return drag;
  }
  
  function enableTransformer() {
    if(assetManager === undefined) enableAssetManager();
    if(drag === undefined) enableDragFrames();
    
    transformer = new Transformer(scene, renderer, camera.camera);
    camera.setTransformer(transformer);
    
    transformer.addGUI(gui.gui);
    transformer._dragFrames = drag;
    transformer._assetManager = assetManager;
    assetManager.setTransformer(transformer);
    
    return transformer;
  }
  
  function animate() {
    controller.update();
    requestAnimationFrame(animate);
    render();
  }
  
  function addToDOM() {
    const container = document.getElementById('container');
    const canvas = container.getElementsByTagName('canvas');
    if (canvas.length > 0) {
      container.removeChild(canvas[0]);
    }
    container.appendChild(renderer.domElement);
    
    window.onresize = function () {
      windowResize(window.innerWidth, window.innerHeight);
    };
    renderer.domElement.addEventListener('keydown', onDocumentKeyDown, false);
    renderer.domElement.addEventListener('keyup', onDocumentKeyUp, false);
  }
  
  function windowResize(w, h) {
    
    if(drag) drag.onWindowResize(w, h);
    camera.onWindowResize(w, h);
    renderer.setSize(w, h);
    render();
  }
  
  function onDocumentKeyDown(event) {
    switch (event.keyCode) {
      case 16: // Shift
        controller.enablePan = true;
        
        break;
      case 73:
        window.InfoCard.hideInfoCard(!window.InfoCard.show);
      
    }
  }
  
  function onDocumentKeyUp(event) {
    switch (event.keyCode) {
      
      case 16: // Shift
        controller.enablePan = false;
        break;
    }
    
  }
  
  
  function render() {
    
    scene.traverse((obj) => {
      if (obj.toCamera) {
        let v = new THREE.Vector3().subVectors(camera.camera.position, obj.position);
        let theta = -Math.atan2(v.x, v.y);
        
        obj.quaternion.set(0, 0, 0, 1);
        obj.rotateZ(theta);
      }
    });
    
    renderer.clear();
    renderer.render(scene, camera.camera);
    
    if(drag) drag.render();
    
  }
  
  
  init();
  
  /* ---------- APIs ---------- */
  this.renderer = renderer;
  this.scene = scene;
  this.gui = gui;
  this.camera = camera.camera;
  this.assetManager = assetManager;
  
  this.enableDragFrames = enableDragFrames;
  this.enableTransformer = enableTransformer;
  this.enableAssetManager = enableAssetManager;
};

export {Viewport};
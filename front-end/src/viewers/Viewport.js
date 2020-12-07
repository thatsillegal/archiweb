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
    window.layer = 0;
    window.objects = [];
  
    /* ---------- renderer ---------- */
    renderer.autoClear = false;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
  
    /* ---------- dom ---------- */
    addToDOM();
    
    /* ---------- gui ---------- */
    gui.initGUI();
    addGUI(gui.gui);
  
    /* ---------- camera ---------- */
    camera.addGUI(gui.gui);
    camera.setController(controller);
  
    /* ---------- control ---------- */
    controller.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      RIGHT: THREE.MOUSE.ROTATE
    }
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

  function to2D() {
    camera.top();
    camera.toggleOrthographic();
    
    controller.enablePan = true;
    controls.pan = true;
    
    controller.enableRotate = false;
    controls.rotate = false;
  
    return camera.camera;
  }

  function to3D() {

    controller.enablePan = false;
    controls.pan = false;
    
    return camera.camera;
  }
  
  
  const controls = new function (){
    this.rotate = true;
    this.pan = false;
    this.zoom = true;
  }
  /* ---------- APIs ---------- */
  this.renderer = renderer;
  this.scene = scene;
  this.gui = gui;
  this.controller = controller;
  this.camera = to3D();
  
  this.enableDragFrames = enableDragFrames;
  this.enableTransformer = enableTransformer;
  this.enableAssetManager = enableAssetManager;
  
  this.to2D = to2D;
  this.to3D = to3D;
  
  /* ---------- GUI ---------- */

  function addGUI(gui) {
    let viewport = gui.addFolder('Viewport');
    console.log(controls);
    console.log(viewport);
    viewport.add(controls, 'rotate').listen().onChange(()=>{
      controller.enableRotate = !controller.enableRotate;
    });
    viewport.add(controls, 'pan').listen().onChange(()=>{
      controller.enablePan = !controller.enablePan;
    });
    viewport.add(controls, 'zoom').listen().onChange(()=>{
      controller.enableZoom = !controller.enableZoom;
    });
  }
  
  init();
};

export {Viewport};
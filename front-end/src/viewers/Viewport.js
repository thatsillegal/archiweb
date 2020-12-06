import * as THREE from 'three';
import * as gui from '@/gui'
import {MultiCamera} from "@/viewers/MultiCamera";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const Viewport = function () {
  
  const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
  const scene = new THREE.Scene();
  
  const camera = new MultiCamera(renderer.domElement);
  const controller = new OrbitControls(camera.camera, renderer.domElement);
  
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
    
  }
  
  
  init();
  
  /* ---------- APIs ---------- */
  this.renderer = renderer;
  this.scene = scene;
  this.gui = gui;
  this.camera = camera.camera;
  this.controller = controller;
};

export {Viewport};
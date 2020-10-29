/* eslint-disable no-unused-vars */
"use strict";

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";

// const OrbitControls = require('three-orbit-controls');

import { DragFrames } from "@/viewers/DragFrames";

const gui = require('@/viewers/gui')

let renderer, camera, scene, light;
let controls, dragControls, dragFrames;

let sceneOrtho, cameraOrtho;

const OFFSET_HEIGHT = 0;
let width = window.innerWidth;
let height = window.innerHeight - OFFSET_HEIGHT;

const objects = [];

let selected = null;
let grouped;


function initRender() {
    renderer = new THREE.WebGLRenderer({antialias: true,  alpha: true });
    renderer.setClearColor( 0x000000, 0 );
    renderer.autoClear = false;
    renderer.setSize(width, height);
    gui.window.width = width;
    gui.window.height = height;
    addToDOM();
}

function initOrthoScene() {
    sceneOrtho = new THREE.Scene();
}

function initPerspectiveCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.set(1000, -1500, 1000);
    camera.up = new THREE.Vector3(0, 0, 1);
}

function initOrthoCamera() {
    cameraOrtho = new THREE.OrthographicCamera(-width/2, width/2, -height/2, height/2, 1, 10);
    cameraOrtho.position.x = width/2-8;
    cameraOrtho.position.y = height/2;
    cameraOrtho.position.z = 10;
}

let axesHelper = new THREE.AxesHelper(5000);
let gridHelper = new THREE.GridHelper(1000,20);

function gridUpdate(value) {
    scene.remove(gridHelper);
    if(value > 0) {
        gridHelper = new THREE.GridHelper(value, 20);
        gridHelper.rotateX(Math.PI/2.0);
        scene.add(gridHelper);
    }
}

function axesUpdate(value) {
    if(value === false)
        scene.remove(axesHelper);
    else
        scene.add(axesHelper);
}

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfafafa);

    scene.add(axesHelper);
    const box = new THREE.BoxBufferGeometry(300, 300, 300);
    // box.scale(0.001, 0.001, 0.001);
    const b1 = new THREE.Mesh(box, new THREE.MeshLambertMaterial({color: 0xdddddd}));
    b1.position.set(150, 150, 150);
    objects.push(b1);
    scene.add(b1);

    const b2 = new THREE.Mesh(box, new THREE.MeshLambertMaterial({color: 0xdddddd}));
    b2.scale.set(1, 1, 1.0/3);
    b2.position.set(-300,-300, 50);
    objects.push(b2);
    scene.add(b2);

    grouped = new THREE.Group();
    scene.add(grouped);

}

function initLight() {
    scene.add(new THREE.AmbientLight(0x404040));

    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, -20, 15);
    scene.add(light);
}

function controlsUpdate(method) {
    if(method === 'Mouse') {
        console.log('now Mouse')


        initPerspectiveCamera();
        initMouseControls();
        initDragControls();
    }
    if(method === 'WASD') {
        console.log('now WASD')


        initPerspectiveCamera();
        initWASDControls();

    }

}

function initDragFrames() {

    dragFrames = new DragFrames(objects, camera, scene, sceneOrtho, renderer);

    dragFrames.enabled = false;
}

function initDragControls() {
    dragControls = new DragControls(objects, camera, renderer.domElement);

    let posZ = 0;
    dragControls.addEventListener( 'dragstart', function ( event ) {

        event.object.material.emissive.set( 0xaaaaaa );
        posZ = event.object.position.z;

    } );

    dragControls.addEventListener('drag', function (event) {
        event.object.position.z = posZ;
    });
    dragControls.addEventListener( 'dragend', function ( event ) {

        event.object.material.emissive.set( 0x000000 );
        // event.object.position.z = 0;

    } );
    dragControls.enabled = false;
}

function initMouseControls() {

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;

    controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        RIGHT: THREE.MOUSE.ROTATE
    }

}

function initWASDControls() {
    controls = new FlyControls(camera, renderer.domElement);

    controls.movementSpeed = 1000;
    controls.domElement = renderer.domElement;
    controls.rollSpeed = Math.PI / 24;
    controls.autoForward = true;
    controls.dragToLook = true;

}

function render() {
    renderer.clear();
    renderer.render(scene, camera);
    renderer.clearDepth();
    renderer.render(sceneOrtho, cameraOrtho);
}

function windowResize(w, h) {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    cameraOrtho.left = -w/2;
    cameraOrtho.right = w/2;
    cameraOrtho.top = -h/2;
    cameraOrtho.bottom = h/2;
    cameraOrtho.position.x = w/2-8;
    cameraOrtho.position.y = h/2;
    cameraOrtho.updateProjectionMatrix();

    renderer.setSize(w, h);
}

//窗口变动触发的函数
function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight - OFFSET_HEIGHT;

    windowResize(width, height);

    gui.window.width = width;
    gui.window.height = height;
}


function animate() {
    //更新控制器
    controls.update();
    render();
    let selected = dragFrames.getSelected();
    if(selected != null && selected.length > 0) {
            console.log(selected);
    }

    requestAnimationFrame(animate);
}


function onDocumentKeyDown(event) {
    let {which: keyCode} = event;
    console.log(keyCode + 'down')
    if (keyCode === 16) {
        controls.enableRotate = false;
        controls.enablePan = true;
        controls.update();
    }
    if (keyCode === 17) {
        controls.enabled = false;
        dragFrames.enabled = true;
    }
    if(keyCode === 18) {
        controls.enabled = false;
        dragControls.enabled = true;
    }

}

function onDocumentKeyUp(event) {
    let {which: keyCode} = event;
    console.log(keyCode + 'up')
    if (keyCode === 16) {
        controls.enableRotate = true;
        controls.enablePan = false;
        controls.update();
    }
    if(keyCode === 17) {
        dragFrames.enabled = false;
        controls.enabled = true;
    }
    if(keyCode === 18) {
        dragControls.enabled = false;
        controls.enabled = true;
    }
}


function init() {
    initRender();
    initScene();
    initOrthoScene();
    initOrthoCamera();
    initLight();
    initPerspectiveCamera();
    // initWASDControls();
    initMouseControls();
    // controlsUpdate(gui.controls.control);
    //
    // initBoxSelection();
    initDragFrames();

    animate();
}

function addToDOM() {
    const container = document.getElementById('container');
    const canvas = container.getElementsByTagName('canvas');
    if (canvas.length > 0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild(renderer.domElement);

    window.onresize = onWindowResize;
    renderer.domElement.addEventListener('keydown', onDocumentKeyDown, false);
    renderer.domElement.addEventListener('keyup', onDocumentKeyUp, false);

}


function main() {
    init();
}

export {
    main,
    windowResize,
    axesUpdate,
    controlsUpdate,
    gridUpdate,
}

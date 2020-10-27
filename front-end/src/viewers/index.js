/* eslint-disable no-unused-vars */
"use strict";

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FlyControls } from "three/examples/jsm/controls/FlyControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { SelectionBox } from "three/examples/jsm/interactive/SelectionBox";
import { SelectionHelper } from "three/examples/jsm/interactive/SelectionHelper";
// const OrbitControls = require('three-orbit-controls');

const gui = require('@/viewers/gui')

let renderer, camera, scene, light;
let controls, dragControls;

let sceneOrtho, cameraOrtho;

const OFFSET_HEIGHT = 0;
let width = window.innerWidth;
let height = window.innerHeight - OFFSET_HEIGHT;

const objects = [];

// function scaleRatio(mesh) {
//     let ratio = 1;
//     switch (gui.window.unit) {
//         case 'Millimeters':
//             ratio = 0.001;
//             break;
//         case 'Kilometers':
//             ratio = 1000;
//             break;
//         default:
//             ratio = 1;
//     }
//     mesh.geometry.scale(ratio, ratio, ratio);
//     return mesh;
// }

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
    camera = new THREE.PerspectiveCamera(40, width / height, 1, 10000);
    camera.position.set(1000, -1500, 1000);
    camera.up = new THREE.Vector3(0, 0, 1);
}

function initOrthoCamera() {
    cameraOrtho = new THREE.OrthographicCamera(-width/2, width/2, -height/2, height/2, 1, 10);
    cameraOrtho.position.x = width/2-8;
    cameraOrtho.position.y = height/2;
    cameraOrtho.position.z = 10;
}

const axesHelper = new THREE.AxesHelper(5000);

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

function initDragControls() {
    dragControls = new DragControls(objects, camera, renderer.domElement);

    dragControls.addEventListener( 'dragstart', function ( event ) {

        event.object.material.emissive.set( 0xaaaaaa );

    } );

    dragControls.addEventListener( 'dragend', function ( event ) {

        event.object.material.emissive.set( 0x000000 );

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
        controls.enabled = true;
    }
    if(keyCode === 18) {
        dragControls.enabled = false;
        controls.enabled = true;
    }
}


let dragInitX, dragInitY, lineFrame;
function drawLineFrame() {

    const points = [];
    points.push(new THREE.Vector3(-0.5,-0.5, 0));
    points.push(new THREE.Vector3(0.5, -0.5, 0));
    points.push(new THREE.Vector3(0.5, 0.5, 0));
    points.push(new THREE.Vector3(-0.5, 0.5, 0));
    points.push(new THREE.Vector3(-0.5, -0.5, 0));

    let geometry = new THREE.BufferGeometry().setFromPoints( points );
    let material = new THREE.LineBasicMaterial({color: 0x000000});
    lineFrame = new THREE.Line(geometry, material);
}


function initBoxSelection() {
    var selectionBox = new SelectionBox( camera, scene );
    var helper = new SelectionHelper( selectionBox, renderer, 'selectBox' );
    drawLineFrame();
    document.addEventListener( 'pointerdown', function ( event ) {

        for ( var item of selectionBox.collection ) {

            item.material.emissive.set( 0x000000 );

        }

        selectionBox.startPoint.set(
            ( event.clientX / window.innerWidth ) * 2 - 1,
            - ( event.clientY / window.innerHeight ) * 2 + 1,
            0.5 );

        dragInitX = event.clientX;
        dragInitY = event.clientY;

        sceneOrtho.add(lineFrame);
        lineFrame.scale.set(1,1,1);
        lineFrame.position.set(dragInitX, dragInitY);

    } );

    document.addEventListener( 'pointermove', function ( event ) {

        if ( helper.isDown ) {

            for (let i = 0; i < selectionBox.collection.length; i ++ ) {

                selectionBox.collection[ i ].material.emissive.set( 0x000000 );

            }

            selectionBox.endPoint.set(
                ( event.clientX / window.innerWidth ) * 2 - 1,
                - ( event.clientY / window.innerHeight ) * 2 + 1,
                0.5 );

            const allSelected = selectionBox.select();

            for (let i = 0; i < allSelected.length; i ++ ) {

                allSelected[ i ].material.emissive.set( 0xffffff );

            }

            lineFrame.scale.set(event.clientX - dragInitX, event.clientY - dragInitY);
            lineFrame.position.set((event.clientX + dragInitX)/2, (event.clientY + dragInitY)/2);

        }

    } );

    document.addEventListener( 'pointerup', function ( event ) {

        selectionBox.endPoint.set(
            ( event.clientX / window.innerWidth ) * 2 - 1,
            - ( event.clientY / window.innerHeight ) * 2 + 1,
            0.5 );

        var allSelected = selectionBox.select();

        for ( var i = 0; i < allSelected.length; i ++ ) {

            allSelected[ i ].material.emissive.set( 0xffffff );

        }

        sceneOrtho.remove(lineFrame);

    } );
}


function init() {
    initRender();
    initScene();
    // initPerspectiveCamera();
    initOrthoScene();
    initOrthoCamera();
    initLight();
    controlsUpdate(gui.controls.control);
    //
    initBoxSelection();
    animate();
}

function addToDOM() {
    var container = document.getElementById('container');
    var canvas = container.getElementsByTagName('canvas');
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
}

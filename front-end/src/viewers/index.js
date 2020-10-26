"use strict";
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {FlyControls} from "three/examples/jsm/controls/FlyControls";
// const OrbitControls = require('three-orbit-controls');

const gui = require('@/viewers/gui')

let renderer, camera, scene, light;
let controls;

let sceneOrtho, cameraOrtho;

const OFFSET_HEIGHT = 188;
let width = window.innerWidth;
let height = window.innerHeight - OFFSET_HEIGHT;

const objects = [];
let hitbox;

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
    cameraOrtho.position.y = height/2+64;
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

    hitbox = new THREE.Mesh(box, new THREE.MeshLambertMaterial({color: 0xffaaaa}));

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
    }
    if(method === 'WASD') {
        console.log('now WASD')


        initPerspectiveCamera();
        initWASDControls();

    }

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
    cameraOrtho.position.y = h/2+64;
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

let shiftDown = false;

function onDocumentKeyDown(event) {
    let {which: keyCode} = event;
    console.log(keyCode + 'down')
    if (keyCode === 16) {
        shiftDown = true;
        controls.enableRotate = false;
        controls.enablePan = true;
        controls.update();
    }
    if (keyCode === 17) {
        controls.enabled = false;
    }
}

function onDocumentKeyUp(event) {
    let {which: keyCode} = event;
    console.log(keyCode + 'up')
    if (keyCode === 16) {
        shiftDown = false;
        controls.enableRotate = true;
        controls.enablePan = false;
        controls.update();
    }
    if(keyCode === 17) {
        controls.enabled = true;
    }
}

function getMouseNDC(clientX, clientY){
    const mouse = new THREE.Vector2();
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;
    return mouse;
}

function getIntersections(clientX, clientY) {
    const mouse = getMouseNDC(clientX, clientY);

    const rayCaster = new THREE.Raycaster();
    rayCaster.setFromCamera(mouse, camera);

    return rayCaster.intersectObjects(objects, true);

}

function onClick(event) {

    event.preventDefault();

    const intersections = getIntersections(event.clientX, event.clientY);

    if (intersections.length > 0) {

        intersections[0].object.add(hitbox)
        console.log(intersections[0].object);
    } else {
        let parent = hitbox.parent;
        if (parent) parent.remove(hitbox);
    }

}
let mouseDown = false;
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


function onMouseDown(event){
    let {which: keyCode} = event;
    if(event.type !== 'mousemove')
        console.log(event.type)
    // console.log(keyCode + ' mouse down');
    if(keyCode === 1) {
        mouseDown=true;

        dragInitX = event.clientX;
        dragInitY = event.clientY;

        sceneOrtho.add(lineFrame);
        lineFrame.scale.set(1,1,1);
        lineFrame.position.set(dragInitX, dragInitY);
        // mouseInit = new THREE.Vector2(event.clientX, event.clientY);
        //
        // geometry = new THREE.PlaneBufferGeometry( 1, 1, 32 );
        // var material = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
        // plane = new THREE.Mesh( geometry, material );
        // sceneOrtho.add(plane);
    }
}

function onMouseMove(event){
    let {which: keyCode} = event;
    // console.log(event.type)
    // console.log(keyCode + ' mouse move');
    if(keyCode === 1 && mouseDown===true && shiftDown === false) {

        lineFrame.scale.set(event.clientX - dragInitX, event.clientY - dragInitY);
        lineFrame.position.set((event.clientX + dragInitX)/2, (event.clientY + dragInitY)/2);
    }
}

function onMouseUp(event) {
    console.log(event.type);
    let {which: keyCode} = event;
    console.log(keyCode + ' mouse up');
    if(keyCode === 1 && mouseDown === true) {
        mouseDown = false;
        sceneOrtho.remove(lineFrame);

        calcIntersections(dragInitX, dragInitY, event.clientX, event.clientY);

    }
}

function calcIntersections(x1, y1, x2, y2) {
    [x1, x2] = x1 > x2 ? [x2, x1] : [x1, x2];
    [y1, y2] = y1 > y2 ? [y2, y1] : [y1, y2];

    const delta = 5;
    const sets = new Set();
    for(let x = x1; x + delta < x2; x += delta) {
        for(let y = y1; y + delta < y2; y += delta) {
            const intersections = getIntersections(x, y);
            intersections.forEach(function(o){
                sets.add(o.object);
            });
            if(intersections.length > 0) {
                sets.add(intersections[0].object);
            }
        }
    }
    sets.forEach(function(o) {
        console.log(o)
        o.add(hitbox);
    })


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
    drawLineFrame();
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
    document.addEventListener('keydown', onDocumentKeyDown, false);
    document.addEventListener('keyup', onDocumentKeyUp, false);
    document.addEventListener('click', onClick, false);
    document.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mouseup', onMouseUp, false);
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

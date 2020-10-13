"use strict";
import * as THREE from 'three'
// import * as gui from '@/viewers/gui'
const OrbitControls = require('three-orbit-controls')(THREE)
const gui = require('@/viewers/gui')

let renderer, camera, scene, light;
let controls;

const offsetHeight = 190;
let width = window.innerWidth;
let height = window.innerHeight - offsetHeight;

var objects = [];
var hitbox;

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
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    gui.window.width = width;
    gui.window.height = height;
    addToDOM();
}

function initPerspectiveCamera() {
    camera = new THREE.PerspectiveCamera(40, width / height, 1, 10000);
    camera.position.set(1000, -1500, 1000);
    camera.up = new THREE.Vector3(0, 0, 1);
}

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xfafafa );
    const axesHelper = new THREE.AxesHelper( gui.window.size );
    const box = new THREE.BoxBufferGeometry(300, 300, 300);
    // box.scale(0.001, 0.001, 0.001);
    const mesh = new THREE.Mesh(box, new THREE.MeshLambertMaterial({color: 0xdddddd}));
    hitbox = new THREE.Mesh(box, new THREE.MeshLambertMaterial({color: 0xeeeeee}));
    mesh.position.set(100, 100, 100);
    objects.push(mesh);
    scene.add(mesh);
    scene.add( axesHelper );
}

function initLight() {
    scene.add(new THREE.AmbientLight(0x404040));

    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, -20, 15);
    scene.add(light);
}

//用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放
function initControls() {

    controls = new OrbitControls(camera, renderer.domElement);

    // 使动画循环使用时阻尼或自转 意思是否有惯性
    controls.enableDamping = true;
    //动态阻尼系数 就是鼠标拖拽旋转灵敏度
    controls.dampingFactor = 0.25;

    controls.minDistance = 1;
    controls.maxDistance = 10000;
    controls.enablePan = false;
    controls.enableZoom = true;

    controls.mouseButtons = {
        ORBIT: THREE.MOUSE.RIGHT,
        PAN: THREE.MOUSE.LEFT
    } 

    controls.enableKeys = false;
}

function render() {
    renderer.render(scene, camera);
}

function windowResize(w, h) {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
}

//窗口变动触发的函数
function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight - offsetHeight;

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
    let keyCode = event.which;
    if (keyCode == 80) {
        console.log('p pressed');
        controls.enablePan = !controls.enablePan;
        console.log(controls.enablePan)
        controls.update();
    } 
}
function onClick( event ) {

    event.preventDefault();

    var mouse = new THREE.Vector2();
    var raycaster = new THREE.Raycaster();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    var intersections = raycaster.intersectObjects( objects, true );

    if( intersections.length > 0) {
        intersections[0].object.add(hitbox);
        console.log( intersections);
    } else {
        var parent = hitbox.parent;
        if(parent) parent.remove(hitbox);
    }
    
}


function init() {
    initRender();
    initScene();
    initPerspectiveCamera();
    initLight();
    initControls();

    animate();
    window.onresize = onWindowResize;
    document.addEventListener( 'keydown', onDocumentKeyDown, false);
    document.addEventListener( 'click', onClick, false );
}

function addToDOM() {
    var container = document.getElementById('container');
    var canvas = container.getElementsByTagName('canvas');
    if (canvas.length > 0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild(renderer.domElement);
}


function main() {
    init();
}

export {
    main,
    windowResize,
}

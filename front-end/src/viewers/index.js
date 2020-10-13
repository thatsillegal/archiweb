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


function initRender() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    gui.window.width = width;
    gui.window.height = height;
    addToDOM();
}

function initPerspectiveCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.set(100, -150, 100);
    camera.up = new THREE.Vector3(0, 0, 1)
}

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xfafafa );
    const axesHelper = new THREE.AxesHelper( gui.window.size );
    const box = new THREE.BoxBufferGeometry(300, 300, 300);
    const mesh = new THREE.Mesh(box, new THREE.MeshLambertMaterial({color: 0xdddddd})) 
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

    controls.minDistance = 20;
    controls.maxDistance = 6000;
    controls.enablePan = false;
    controls.enableZoom = true;
}

function render() {
    renderer.render(scene, camera);
}

function windowResize(w, h) {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    render();

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


function init() {
    initRender();
    initScene();
    initPerspectiveCamera();
    initLight();
    initControls();

    animate();
    window.onresize = onWindowResize;

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

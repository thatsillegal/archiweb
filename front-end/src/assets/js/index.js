"use strict";
import * as THREE from 'three'
// import * as gui from '@/assets/js/gui'
var OrbitControls = require('three-orbit-controls')(THREE)

var offsetHeight = 190;
var renderer;




function initRender() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight - offsetHeight);
    addToDOM();
}

var camera;
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight - offsetHeight), 1, 10000);
    camera.position.set(100, -150, 100);
    camera.up = new THREE.Vector3(0, 0, 1)
}

var scene;
function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
    var axesHelper = new THREE.AxesHelper( 5000 );
    scene.add( axesHelper );
}

var light;
function initLight() {
    scene.add(new THREE.AmbientLight(0x404040));

    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, -20, 15);
    scene.add(light);
}

//用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放
var controls;
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

//窗口变动触发的函数
function onWindowResize() {
    camera.aspect = window.innerWidth / (window.innerHeight - offsetHeight);
    camera.updateProjectionMatrix();
    render();
    renderer.setSize(window.innerWidth, window.innerHeight - offsetHeight);

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
    initCamera();
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
    main
}

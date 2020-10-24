"use strict";
import * as THREE from 'three'
// import * as gui from '@/viewers/gui'
const OrbitControls = require('three-orbit-controls')(THREE)
const gui = require('@/viewers/gui')

let renderer, camera, scene, light;
let controls;

let sceneOrtho, cameraOrtho;

const offsetHeight = 190;
let width = window.innerWidth;
let height = window.innerHeight - offsetHeight;

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
    const mesh = new THREE.Mesh(box, new THREE.MeshLambertMaterial({color: 0xdddddd}));
    hitbox = new THREE.Mesh(box, new THREE.MeshLambertMaterial({color: 0xffaaaa}));
    mesh.position.set(150, 150, 150);
    objects.push(mesh);
    scene.add(mesh);
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

let shiftDown = false;

function onDocumentKeyDown(event) {
    let {which: keyCode} = event;
    console.log(keyCode + 'down')
    if (keyCode === 16) {
        shiftDown = true;
        controls.enablePan = true;
        controls.update();
    }
}

function onDocumentKeyUp(event) {
    let {which: keyCode} = event;
    console.log(keyCode + 'up')
    if (keyCode === 16) {
        shiftDown = false;
        controls.enablePan = false;
        controls.update();
    }
}

function getCurrentMouse(event){
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    return mouse;
}

function onClick(event) {

    event.preventDefault();

    const mouse = getCurrentMouse(event);

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersections = raycaster.intersectObjects(objects, true);

    if (intersections.length > 0) {
        intersections[0].object.add(hitbox);
        console.log(intersections);
    } else {
        var parent = hitbox.parent;
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

    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const material = new THREE.LineDashedMaterial({color: 0x000000});
    lineFrame = new THREE.Line(geometry, material);
    sceneOrtho.add(lineFrame);
}


function onMouseDown(event){
    let {which: keyCode} = event;
    if(keyCode === 1) {
        console.log('mouse down' + keyCode)
        mouseDown=true;

        dragInitX = event.clientX;
        dragInitY = event.clientY;

        drawLineFrame();
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
    if(keyCode === 1 && mouseDown===true && shiftDown === false) {
        console.log('mouse move' + keyCode)
        console.log(event);

        // plane.scale.set(event.clientX - mouseInit.x, event.clientY - mouseInit.y, 1);
        // plane.position.set((mouseInit.x + event.clientX)/2,(mouseInit.y + event.clientY)/2);
        // drawLineFrame(dragInitX, dragInitY, event.clientX, event.clientY);
        lineFrame.scale.set(event.clientX - dragInitX, event.clientY - dragInitY);
        lineFrame.position.set((event.clientX + dragInitX)/2, (event.clientY + dragInitY)/2);
    }
}

function onMouseUp(event) {
    let {which: keyCode} = event;
    if(keyCode === 1) {
        console.log('mouse up' + keyCode)
        mouseDown = false;
        sceneOrtho.remove(lineFrame);
    }
}

function init() {
    initRender();
    initScene();
    initOrthoScene();
    initPerspectiveCamera();
    initOrthoCamera();
    initLight();
    initControls();

    animate();
    window.onresize = onWindowResize;
    document.addEventListener('keydown', onDocumentKeyDown, false);
    document.addEventListener('keyup', onDocumentKeyUp, false);
    document.addEventListener('click', onClick, false);
    document.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('mouseup', onMouseUp, false);
    document.addEventListener('mousemove', onMouseMove, false);
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
    axesUpdate,
}

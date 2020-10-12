"use strict";
import * as dat from 'dat.gui';

const index = require('@/viewers/index');

var gui;
var window = new function() {
    this.width = 0;
    this.height = 0;
    this.size = 5000;
    this.unit = 'Millimeters'

    this.update = function() {
        index.windowResize(this.width, this.height);
    }
}

var controls = new function() {
    this.mode = 'Perspective';
    this.control = 'Mouse';
    this.pan = false;
    this.zoom = true;
}

function initGUI() {
    gui = new dat.GUI({autoPlace: false});

    const canvas = gui.addFolder('Canvas');
    canvas.add(window, 'width').min(0).max(5000).step(10).listen();
    canvas.add(window, 'height').min(0).max(5000).step(10).listen();
    canvas.add(window, 'size').min(1).max(10000).step(10).listen();
    canvas.add(window, 'unit', ['Millimeters', 'Meters', 'Kilometers']);
    canvas.open();

    const camera = gui.addFolder('Camera');
    camera.add(controls, 'control', ['WASD', 'Mouse']);
    camera.add(controls, 'mode', ['2D', 'Perspective', 'Parallel']);
    camera.add(controls, 'pan').listen();
    camera.add(controls, 'zoom').listen();
    camera.open();

    const util = gui.addFolder('Utils');
    util.add(window, 'update');
    util.open();

    const container = document.getElementById('gui-container');
    container.appendChild(gui.domElement);
}

export {
    window,
    initGUI
}

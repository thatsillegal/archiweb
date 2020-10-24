"use strict";
import * as dat from 'dat.gui';

const index = require('@/viewers/index');

let gui;
const window = new function () {
    this.width = 0;
    this.height = 0;
    this.axes = true;

    this.unit = 'Millimeters'

    this.update = function () {
        index.windowResize(this.width, this.height);
    }
};

const controls = new function () {
    this.mode = 'Perspective';
    this.control = 'Mouse';
};

function initGUI() {
    gui = new dat.GUI({autoPlace: false});

    const canvas = gui.addFolder('Canvas');
    canvas.add(window, 'width').min(0).max(5000).step(10).listen().onChange(
        function (){
            index.windowResize(window.width, window.height);
        }
    );
    canvas.add(window, 'height').min(0).max(5000).step(10).listen().onChange(
        function (){
            index.windowResize(window.width, window.height);
        }
    );
    canvas.add(window, 'axes').listen().onChange(
        function() {
            index.axesUpdate(window.axes);
        }
    );
    canvas.add(window, 'unit', ['Millimeters', 'Meters', 'Kilometers']);
    canvas.open();

    const camera = gui.addFolder('Camera');
    camera.add(controls, 'control', ['WASD', 'Mouse']);
    camera.add(controls, 'mode', ['2D', 'Perspective', 'Parallel']);
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

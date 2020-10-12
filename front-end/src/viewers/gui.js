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

function initGUI() {
    gui = new dat.GUI({autoPlace: false});
    var settings = gui.addFolder('Settings');
    settings.add(window, 'width').min(0).max(5000).step(10).listen();
    settings.add(window, 'height').min(0).max(5000).step(10).listen();
    settings.add(window, 'size').min(1).max(10000).step(10).listen();
    settings.add(window, 'unit', ['Millimeters', 'Meters', 'Kilometers']);
    settings.open();
    var util = gui.addFolder('Utils');
    util.add(window, 'update');
    util.open();

    var container = document.getElementById('gui-container');
    container.appendChild(gui.domElement);
}

export {
    window,
    initGUI
}

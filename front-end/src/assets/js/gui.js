"use strict";
import * as dat from 'dat.gui';

var gui;
var controls = new function() {
    this.width = 500;
    this.height = 500;
    this.step = 3;

}

function initGUI() {
    gui = new dat.GUI({autoPlace: false});
    var settings = gui.addFolder('Settings');
    settings.add(controls, 'width').min(0).max(5000).step(10);
    settings.add(controls, 'height').min(0).max(5000).step(10);
    settings.add(controls, 'step').min(1).max(5).step(1);
    settings.open();
    var util = gui.addFolder('Utils');
    util.open();

    var container = document.getElementById('gui-container');
    container.appendChild(gui.domElement);
}

export {
    controls,
    initGUI
}

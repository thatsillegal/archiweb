import * as THREE from 'three'


let DragFrames = function(_objects, _camera, _orbitCamera, _domElement) {



}

DragFrames.prototype = Object.create( THREE.EventDispatcher.prototype );
DragFrames.prototype.constructor = DragFrames;

export { DragFrames };
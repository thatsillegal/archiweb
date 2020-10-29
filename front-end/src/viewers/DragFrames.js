// /* eslint-disable no-unused-vars */
import * as THREE from 'three'
import { SelectionBox } from "three/examples/jsm/interactive/SelectionBox";
// import { SelectionHelper } from "three/examples/jsm/interactive/SelectionHelper";

var DragFrames = function(_objects, _camera, _scene, _orthoScene, _renderer) {

    let _selectionBox = new SelectionBox( _camera, _scene );
    // let _helper = new SelectionHelper( _selectionBox, _renderer, 'selectBox' );
    let _domElement = _renderer.domElement;
    let _dragInitX;
    let _dragInitY
    let _lineFrame, _geometry = null;
    let _selectDown = false;

    let _selected = null;

    let scope = this;


    function drawLineFrame(initX, initY, X, Y) {
        _orthoScene.remove(_lineFrame);

        let material = (initX > X) ?
            new THREE.LineDashedMaterial({color: 0x000000, dashSize: 5, gapSize: 3}):
            new THREE.LineBasicMaterial({color: 0x000000});

        let l = Math.min(initX, X);
        let r = Math.max(initX, X);
        let b = Math.min(initY, Y);
        let t = Math.max(initY, Y);

        const points = [];
        points.push(new THREE.Vector3(l,b, 0));
        points.push(new THREE.Vector3(r, b, 0));
        points.push(new THREE.Vector3(r, t, 0));
        points.push(new THREE.Vector3(l, t, 0));
        points.push(new THREE.Vector3(l, b, 0));

        if(_geometry != null) _geometry.dispose();
        _geometry = new THREE.BufferGeometry().setFromPoints( points );
        _lineFrame = new THREE.Line(_geometry, material);
        _lineFrame.computeLineDistances();
        _orthoScene.add(_lineFrame);
    }


    function activate() {
        _domElement.addEventListener( 'pointerdown', onDocumentPointerDown, false);
        _domElement.addEventListener( 'pointermove', onDocumentPointerMove, false);
        _domElement.addEventListener( 'pointerup', onDocumentPointerUp, false);

    }


    function deactivate() {
        _domElement.removeEventListener( 'pointerdown', onDocumentPointerDown, false);
        _domElement.removeEventListener( 'pointermove', onDocumentPointerMove, false);
        _domElement.removeEventListener( 'pointerup', onDocumentPointerUp, false);
    }

    function dispose() {

        deactivate();

    }

    function getObjects() {

        return _objects;

    }

    function getSelected() {
        return _selected;
    }


    function onDocumentPointerDown( event ) {
        for (const item of _selectionBox.collection ) {

            if(item.type === "AxesHelper") continue;
            item.material.emissive.set( 0x000000 );

        }
        _selected = null;

        if(scope.enabled) {
            _selectionBox.startPoint.set(
                ( event.clientX / window.innerWidth ) * 2 - 1,
                - ( event.clientY / window.innerHeight ) * 2 + 1,
                0.5 );

            _dragInitX = event.clientX;
            _dragInitY = event.clientY;

            _selectDown = true;
            // _orthoScene.add(_lineFrame);
            // _lineFrame.scale.set(1, 1, 1);
            // _lineFrame.position.set(_dragInitX, _dragInitY);

        }
    }


    function onDocumentPointerMove( event ) {

        if ( _selectDown ) {
                for (const item of _selectionBox.collection ) {

                if(item.type === "AxesHelper") continue;
                if(item.type === "GridHelper") continue;
                item.material.emissive.set( 0x000000 );

            }
            _selected = null;

            if(scope.enabled) {

                _selectionBox.endPoint.set(
                    (event.clientX / window.innerWidth) * 2 - 1,
                    -(event.clientY / window.innerHeight) * 2 + 1,
                    0.5);

                const allSelected = _selectionBox.select();

                for (const item of allSelected) {
                    if(item.type === "AxesHelper") continue;
                    if(item.type === "GridHelper") continue;
                    item.material.emissive.set(0x666666);

                }
                _selected = _selectionBox.select();
                //
                // scope.dispatchEvent({type: 'drag'}, _objects = _selected);
                drawLineFrame(_dragInitX, _dragInitY, event.clientX, event.clientY);

                // _lineFrame.scale.set(event.clientX - _dragInitX, event.clientY - _dragInitY);
                // _lineFrame.position.set((event.clientX + _dragInitX) / 2, (event.clientY + _dragInitY) / 2);
                //
                // _lineFrame.computeLineDistances();
            }
        }


    }


    function onDocumentPointerUp( event ) {
        _orthoScene.remove(_lineFrame);
        _selectDown = false;

        if(scope.enabled) {
            _selectionBox.endPoint.set(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1,
                0.5);



            var allSelected = _selectionBox.select();

            for (const item of allSelected) {
                if(item.type === "AxesHelper") continue;
                if(item.type === "GridHelper") continue;
                item.material.emissive.set(0x666666);

            }
            _selected = _selectionBox.select();
        }

            // scope.dispatchEvent({type: 'drag'}, _objects = _selected);


    }

    activate();

    this.enabled = true;

    this.activate = activate;
    this.deactivate = deactivate;
    this.dispose = dispose;
    this.getObjects = getObjects;
    this.getSelected = getSelected;
}

DragFrames.prototype = Object.create( THREE.EventDispatcher.prototype );
DragFrames.prototype.constructor = DragFrames;

export { DragFrames };
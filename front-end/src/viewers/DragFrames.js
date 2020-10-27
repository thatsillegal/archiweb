// /* eslint-disable no-unused-vars */
import * as THREE from 'three'
import { SelectionBox } from "three/examples/jsm/interactive/SelectionBox";
import { SelectionHelper } from "three/examples/jsm/interactive/SelectionHelper";

var DragFrames = function(_objects, _camera, _scene, _orthoScene, _renderer) {

    let _selectionBox = new SelectionBox( _camera, _scene );
    let _helper = new SelectionHelper( _selectionBox, _renderer, 'selectBox' );
    let _domElement = _renderer.domElement;
    let _dragInitX;
    let _dragInitY
    let _lineFrame;

    let scope = this;


    function drawLineFrame() {

        const points = [];
        points.push(new THREE.Vector3(-0.5,-0.5, 0));
        points.push(new THREE.Vector3(0.5, -0.5, 0));
        points.push(new THREE.Vector3(0.5, 0.5, 0));
        points.push(new THREE.Vector3(-0.5, 0.5, 0));
        points.push(new THREE.Vector3(-0.5, -0.5, 0));

        let geometry = new THREE.BufferGeometry().setFromPoints( points );
        let material = new THREE.LineBasicMaterial({color: 0x000000});
        _lineFrame = new THREE.Line(geometry, material);
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


    function onDocumentPointerDown( event ) {
        for ( var item of _selectionBox.collection ) {

            item.material.emissive.set( 0x000000 );

        }

        _selectionBox.startPoint.set(
            ( event.clientX / window.innerWidth ) * 2 - 1,
            - ( event.clientY / window.innerHeight ) * 2 + 1,
            0.5 );

        _dragInitX = event.clientX;
        _dragInitY = event.clientY;

        if(scope.enabled) {
            _orthoScene.add(_lineFrame);
            _lineFrame.scale.set(1, 1, 1);
            _lineFrame.position.set(_dragInitX, _dragInitY);
        }
    }


    function onDocumentPointerMove( event ) {
        if ( _helper.isDown && scope.enabled) {

            for (let i = 0; i < _selectionBox.collection.length; i ++ ) {

                _selectionBox.collection[ i ].material.emissive.set( 0x000000 );

            }

            _selectionBox.endPoint.set(
                ( event.clientX / window.innerWidth ) * 2 - 1,
                - ( event.clientY / window.innerHeight ) * 2 + 1,
                0.5 );

            const allSelected = _selectionBox.select();

            for (let i = 0; i < allSelected.length; i ++ ) {

                allSelected[ i ].material.emissive.set( 0xffffff );

            }

            _lineFrame.scale.set(event.clientX - _dragInitX, event.clientY - _dragInitY);
            _lineFrame.position.set((event.clientX + _dragInitX)/2, (event.clientY + _dragInitY)/2);
        }


    }


    function onDocumentPointerUp( event ) {
        if(scope.enabled) {
            _selectionBox.endPoint.set(
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1,
                0.5);

            var allSelected = _selectionBox.select();

            for (var i = 0; i < allSelected.length; i++) {

                allSelected[i].material.emissive.set(0xffffff);

            }

            _orthoScene.remove(_lineFrame);
        }
    }

    activate();
    drawLineFrame();

    this.enabled = true;

    this.activate = activate;
    this.deactivate = deactivate;
    this.dispose = dispose;
    this.getObjects = getObjects;
}

DragFrames.prototype = Object.create( THREE.EventDispatcher.prototype );
DragFrames.prototype.constructor = DragFrames;

export { DragFrames };
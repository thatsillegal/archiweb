import * as THREE from 'three'
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import {WireframeGeometry2} from "three/examples/jsm/lines/WireframeGeometry2";
import {Wireframe} from "three/examples/jsm/lines/Wireframe";

/**
 *      ___           ___           ___           ___                       ___           ___           ___
 *     /\  \         /\  \         /\  \         /\__\          ___        /\__\         /\  \         /\  \
 *    /::\  \       /::\  \       /::\  \       /:/  /         /\  \      /:/ _/_       /::\  \       /::\  \
 *   /:/\:\  \     /:/\:\  \     /:/\:\  \     /:/__/          \:\  \    /:/ /\__\     /:/\:\  \     /:/\:\  \
 *  /::\~\:\  \   /::\~\:\  \   /:/  \:\  \   /::\  \ ___      /::\__\  /:/ /:/ _/_   /::\~\:\  \   /::\~\:\__\
 * /:/\:\ \:\__\ /:/\:\ \:\__\ /:/__/ \:\__\ /:/\:\  /\__\  __/:/\/__/ /:/_/:/ /\__\ /:/\:\ \:\__\ /:/\:\ \:|__|
 * \/__\:\/:/  / \/_|::\/:/  / \:\  \  \/__/ \/__\:\/:/  / /\/:/  /    \:\/:/ /:/  / \:\~\:\ \/__/ \:\~\:\/:/  /
 *      \::/  /     |:|::/  /   \:\  \            \::/  /  \::/__/      \::/_/:/  /   \:\ \:\__\    \:\ \::/  /
 *      /:/  /      |:|\/__/     \:\  \           /:/  /    \:\__\       \:\/:/  /     \:\ \/__/     \:\/:/  /
 *     /:/  /       |:|  |        \:\__\         /:/  /      \/__/        \::/  /       \:\__\        \::/__/
 *     \/__/         \|__|         \/__/         \/__/                     \/__/         \/__/         ~~
 *
 *
 *
 * Copyright (c) 2020-present, Inst.AAA.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Date: 2020-11-12
 * Author: Yichen Mo
 */
import {setPolygonOffsetMaterial} from "@/creator/MaterialFactory";

const GeometryFactory = function (_scene) {
  
  const lineMaterial = new THREE.LineBasicMaterial({color:0x000000});
  
  
  // Box Basic
  const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
  boxGeometry.translate(0, 0, 0.5);

  
  // Cylinder Basic
  const cylinderGeometry = new THREE.CylinderBufferGeometry(1, 1, 1, 32)
  cylinderGeometry.rotateX(Math.PI / 2);
  cylinderGeometry.translate(0, 0, 0.5);

  
  // const scope = this;
  // API
  this.Box = function ([x, y, z], [w, h, d], material) {
    material.polygonOffset = true;
    material.polygonOffsetFactor = 1.0;
    material.polygonOffsetUnits = 1.0;
    
    let mesh = new THREE.Mesh(boxGeometry, material);
    sceneAddMesh(_scene, mesh)
    
    mesh.type = 'Box';
    mesh.scale.set(w, h, d);
    mesh.position.set(x, y, z);
    
    publicProperties(mesh);
    
    return mesh;
  }
  
  this.Cylinder = function ([x, y, z], [r, h], material, showEdge = false) {
    let mesh = new THREE.Mesh(cylinderGeometry, material);
    sceneAddMesh(_scene, mesh, showEdge);
    
    mesh.type = 'Cylinder';
    mesh.scale.set(r, r, h);
    mesh.position.set(x, y, z);
    
    publicProperties(mesh);
    return mesh;
  }
  
  let curveObject, leftCurve, rightCurve;
  this.Curve = function (objects) {
    _scene.remove(curveObject);
    let positions = [];
    for (let obj of objects) {
      let p = obj.position.clone();
      p.z = -1;
      positions.push(p);
    }
    const curve = new THREE.CatmullRomCurve3(positions);
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    curveObject = new THREE.Line(geometry, lineMaterial);
    _scene.add(curveObject);
    
    drawOffsetSplineLine(curve)
  }
  
  function updateModel (mesh, modelParam) {
    switch (mesh.type) {
      case 'Box' :
        mesh.scale.x = modelParam['w'];
        mesh.scale.y = modelParam['h'];
        mesh.scale.z = modelParam['d'];
        break;
      case 'Cylinder' :
        mesh.scale.x = modelParam['r'];
        mesh.scale.y = modelParam['r'];
        mesh.scale.z = modelParam['h'];
        break;
      default:
        break;
    }
  }
  
  function modelParam (mesh) {
    switch (mesh.type) {
      case 'Box':
        return {w: mesh.scale.x, h: mesh.scale.y, d: mesh.scale.z};
      case 'Cylinder':
        return {r: mesh.scale.x, h: mesh.scale.z};
      default:
        return {};
    }
  }
  

  function drawOffsetSplineLine(curve) {
    _scene.remove(leftCurve);
    _scene.remove(rightCurve);
    let left = [];
    let right = [];
    for (let t = 0.0; t <= 1.0; t += 0.02) {
      let point = curve.getPointAt(t);
      
      let tangent = curve.getTangentAt(t);
      let extension1 = new THREE.Vector3(tangent.x * 2, tangent.y * 2, 0);
      let extension2 = new THREE.Vector3(-tangent.x * 2, -tangent.y * 2, 0);
      
      let tangentGeometry = new THREE.BufferGeometry().setFromPoints([extension2, tangent, extension1]);
      let tangentLine = new THREE.Line(tangentGeometry, new THREE.LineBasicMaterial({color: 0xff000}))
      tangentLine.position.copy(point);
      tangentLine.rotateZ(Math.PI / 2);
      // scene.add(tangentLine);
      
      tangentLine.updateMatrixWorld(true);
      let normal = tangentLine.geometry.clone();
      normal.applyMatrix4(tangentLine.matrix);
      
      let position = normal.attributes.position;
      left.push(new THREE.Vector3(position.getX(0), position.getY(0), 0));
      right.push(new THREE.Vector3(position.getX(2), position.getY(2), 0));
      
    }
    
    let cv = new THREE.CatmullRomCurve3(left);
    let points = cv.getPoints(50);
    let geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    leftCurve = new THREE.Line(geometry, lineMaterial);
    
    cv = new THREE.CatmullRomCurve3(right);
    points = cv.getPoints(50);
    geometry = new THREE.BufferGeometry().setFromPoints(points);
    rightCurve = new THREE.Line(geometry, lineMaterial);
    
    _scene.add(leftCurve);
    _scene.add(rightCurve);
  }
  
  
  function publicProperties (mesh) {
    
    mesh.updateModel = updateModel;
    mesh.modelParam = modelParam;
    
    mesh.exchange = true;
    mesh.toArchiJSON = function () {
      return {type: mesh.type, matrix: mesh.matrix.elements};
    }
    
    mesh.toInfoCard = function () {
      let o = mesh;
      window.InfoCard.info.uuid = o.uuid;
      window.InfoCard.info.position = o.position;
      window.InfoCard.info.model = o.modelParam(o);
      window.InfoCard.info.model = o.modelParam(o);
      window.InfoCard.info.properties = {
        type: o.type, material:
          JSON.stringify({
            type: o.material.type,
            uuid: o.material.uuid,
            color: o.material.color,
            opacity: o.material.opacity
          })
        , matrix: o.matrix.elements
      };
    }
  }
  
}


function createMeshEdge(mesh, color = 0x000000) {
  
  setPolygonOffsetMaterial(mesh.material);
  
  const matLine = new THREE.LineBasicMaterial({color: color});
  const geoLine = new THREE.EdgesGeometry(mesh.geometry);
  return new THREE.LineSegments(geoLine, matLine);
}

function createMeshWireframe(mesh, color = 0xffff00, linewidth) {
  
  setPolygonOffsetMaterial(mesh.material);
  
  const matLine = new LineMaterial({color: color, linewidth: linewidth});
  const geoLine = new WireframeGeometry2(mesh.geometry);
  const wireframe = new Wireframe(geoLine, matLine);
  wireframe.computeLineDistances();
  wireframe.scale.set(1, 1, 1);
  return wireframe;
}

function sceneAddMesh (_scene, mesh, showEdge = true) {
  if (showEdge) {
    mesh.add(createMeshWireframe(mesh, 0xffff00, 0.005));
    mesh.add(createMeshEdge(mesh));
    mesh.children[0].visible = false;
  }
  
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  
  mesh.layer = [0];
  _scene.add(mesh);
}
export {
  GeometryFactory,
  sceneAddMesh,
  createMeshWireframe,
  createMeshEdge
};
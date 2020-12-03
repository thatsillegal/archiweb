import * as THREE from 'three'
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import {WireframeGeometry2} from "three/examples/jsm/lines/WireframeGeometry2";
import {Wireframe} from "three/examples/jsm/lines/Wireframe";
// import {Float32BufferAttribute} from 'three'


const GeometryFactory = function (_scene) {
  
  const lineMaterial =  new THREE.LineBasicMaterial({color: 0x000000});
  
  // Box Basic
  const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
  boxGeometry.translate(0, 0, 0.5);
  
  const boxEdges = new THREE.EdgesGeometry(boxGeometry);
  const boxLine = new THREE.LineSegments(boxEdges, lineMaterial);
  
  
  // Cylinder Basic
  const cylinderGeometry = new THREE.CylinderBufferGeometry(1, 1, 1, 32)
  cylinderGeometry.rotateX(Math.PI/2);
  cylinderGeometry.translate(0, 0, 0.5);
  
  const cylinderEdges = new THREE.EdgesGeometry(cylinderGeometry);
  const cylinderLine = new THREE.LineSegments(cylinderEdges, lineMaterial);
  
  
  const scope = this;
  // API
  this.Box = function ([x, y, z], [w, h, d], material) {
    material.polygonOffset = true;
    material.polygonOffsetFactor = 1.0;
    material.polygonOffsetUnits = 1.0;
  
    let mesh = new THREE.Mesh(boxGeometry, material);
    scope.sceneAddMesh(mesh, boxLine.clone())
    
    mesh.type = 'Box';
    mesh.scale.set(w, h, d);
    mesh.position.set(x, y, z);
    
    scope.publicProperties(mesh);
    
    return mesh;
  }
  
  this.Cylinder = function([x, y, z], [r, h], material, showEdge=false) {
    let mesh = new THREE.Mesh(cylinderGeometry, material);
    scope.sceneAddMesh(mesh, cylinderLine.clone(), showEdge);
    material.polygonOffset = true;
    material.polygonOffsetFactor = 1.0;
    material.polygonOffsetUnits = 1.0;
  
    mesh.type = 'Cylinder';
    mesh.scale.set(r, r, h);
    mesh.position.set(x, y, z);
   
    scope.publicProperties(mesh);
    return mesh;
  }
  
  let curveObject, leftCurve, rightCurve;
  this.Curve = function (objects) {
    _scene.remove(curveObject);
    let positions = [];
    for(let obj of objects) {
      let p = obj.position.clone();
      p.z = -1;
      positions.push(p);
    }
    const curve = new THREE.CatmullRomCurve3(positions);
    const points = curve.getPoints( 50 );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    
    curveObject = new THREE.Line( geometry, lineMaterial );
    _scene.add(curveObject);
    drawOffsetSplineLine(curve)
  }

  this.updateModel = function(mesh, modelParam) {
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
  
  this.modelParam = function(mesh) {
    switch (mesh.type) {
      case 'Box':
        return {w:mesh.scale.x, h:mesh.scale.y, d:mesh.scale.z};
      case 'Cylinder':
        return {r:mesh.scale.x, h:mesh.scale.z};
      default:
        return {};
    }
  }
  
  function meshLine(geometry, color, linewidth) {
    const matLine = new LineMaterial({color: color, linewidth: linewidth});
    const geoLine = new WireframeGeometry2(geometry);
    const wireframe = new Wireframe(geoLine, matLine);
    wireframe.computeLineDistances();
    wireframe.scale.set(1, 1, 1);
    return wireframe;
  }
  function drawOffsetSplineLine(curve) {
    _scene.remove(leftCurve);
    _scene.remove(rightCurve);
    let left = [];
    let right = [];
    for(let t = 0.0; t <= 1.0; t += 0.02) {
      let point = curve.getPointAt(t);
      
      let tangent = curve.getTangentAt(t);
      let extension1 = new THREE.Vector3(tangent.x*2, tangent.y*2, 0);
      let extension2 = new THREE.Vector3(-tangent.x*2, -tangent.y*2, 0);
      
      let tangentGeometry = new THREE.BufferGeometry().setFromPoints( [extension2, tangent, extension1] );
      let tangentLine = new THREE.Line(tangentGeometry, new THREE.LineBasicMaterial({color:0xff000}))
      tangentLine.position.copy(point);
      tangentLine.rotateZ(Math.PI/2);
      // scene.add(tangentLine);
      
      tangentLine.updateMatrixWorld(true);
      let normal = tangentLine.geometry.clone();
      normal.applyMatrix4(tangentLine.matrix);
      
      let position = normal.attributes.position;
      left.push(new THREE.Vector3(position.getX(0), position.getY(0), 0));
      right.push(new THREE.Vector3(position.getX(2), position.getY(2), 0));
      
    }
    
    let cv = new THREE.CatmullRomCurve3(left);
    let points = cv.getPoints( 50 );
    let geometry = new THREE.BufferGeometry().setFromPoints( points );
    
    leftCurve = new THREE.Line( geometry, lineMaterial );
    
    cv = new THREE.CatmullRomCurve3(right);
    points = cv.getPoints( 50 );
    geometry = new THREE.BufferGeometry().setFromPoints( points );
    rightCurve = new THREE.Line(geometry, lineMaterial);
    
    _scene.add(leftCurve);
    _scene.add(rightCurve);
  }
  

  
  this.publicProperties = function(mesh){
  
    mesh.updateModel = scope.updateModel;
    mesh.modelParam = scope.modelParam;
  
    mesh.exchange = true;
    mesh.toArchiJSON = function() {
      return {type: mesh.type, matrix: mesh.matrix.elements};
    }
  
    mesh.toInfoCard = function() {
      let o = mesh;
      window.InfoCard.info.uuid = o.uuid;
      window.InfoCard.info.position = o.position;
      window.InfoCard.info.model = o.modelParam(o);
      window.InfoCard.info.model = o.modelParam(o);
      window.InfoCard.info.properties = {type: o.type, material:
          JSON.stringify({type: o.material.type, uuid: o.material.uuid, color: o.material.color, opacity:o.material.opacity})
        , matrix:o.matrix.elements};
    }
  }
  
   this.sceneAddMesh = function(mesh, line, showEdge=true) {
     if(showEdge) {
       mesh.add(meshLine(mesh.geometry, 0xffff00, 0.005));
       mesh.add(line);
       mesh.children[0].visible = false;
     }
  
     mesh.castShadow = true;
     mesh.receiveShadow = true;
  
     mesh.layer = [0];
     _scene.add(mesh);
  }
  
   this.setMeshMaterial = function (mesh, material) {
     material.polygonOffset = true;
     material.polygonOffsetFactor = 1.0;
     material.polygonOffsetUnits = 1.0;
  
    if(mesh.material.length > 0) {
      let materials = []
      mesh.material.forEach(()=>materials.push(material));
      mesh.material = materials;
    } else {
      mesh.material=material;
    }
  }
  this.setMaterialOpacity = function(mesh, opacity) {
    if(mesh.material.length > 0) {
      mesh.material.forEach((item)=>{
        item.transparent = true;
        item.opacity = opacity;
      });
    } else {
      mesh.material.transparent = true;
      mesh.material.opacity = opacity;
    }
  }
  
}


export {
  GeometryFactory,
}
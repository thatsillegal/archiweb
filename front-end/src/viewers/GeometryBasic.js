import * as THREE from 'three'
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import {WireframeGeometry2} from "three/examples/jsm/lines/WireframeGeometry2";
import {Wireframe} from "three/examples/jsm/lines/Wireframe";
// import {Float32BufferAttribute} from 'three'


const GeometryBasic = function (_scene, _objects) {
  
  const lineMaterial =  new THREE.LineBasicMaterial({color: 0x000000});
  const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
  boxGeometry.translate(0, 0, 0.5);
  const boxEdges = new THREE.EdgesGeometry(boxGeometry);
  const boxLine = new THREE.LineSegments(boxEdges, lineMaterial);
  const scope = this;
  
  // API
  this.Box = function ([x, y, z], [w, h, d], material) {
    
    let mesh = new THREE.Mesh(boxGeometry, material);
    
    mesh.type = 'Box';
    mesh.scale.set(w, h, d);
    mesh.position.set(x, y, z);
    
    scope.sceneAddMesh(mesh, boxLine.clone())
    mesh.updateModel = scope.updateModel;
    mesh.modelParam = scope.modelParam;
    
    mesh.exchange = true;
    mesh.toArchiJSON = function() {
      return {type: mesh.type, matrix: mesh.matrix.elements};
    }
  
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
    // const material = new THREE.LineBasicMaterial( { color : 0x000000 } );

// Create the final object to add to the scene
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
      default:
        break;
    }
  }
  
  this.modelParam = function(mesh) {
    switch (mesh.type) {
      case 'Box':
        return {w:mesh.scale.x, h:mesh.scale.y, d:mesh.scale.z};
      default:
        return {};
    }
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
  
  function meshLine(geometry, color, linewidth) {
    const matLine = new LineMaterial({color: color, linewidth: linewidth});
    const geoLine = new WireframeGeometry2(geometry);
    const wireframe = new Wireframe(geoLine, matLine);
    wireframe.computeLineDistances();
    wireframe.scale.set(1, 1, 1);
    return wireframe;
  }
  
  
   this.sceneAddMesh = function(mesh, line) {
    mesh.add(meshLine(mesh.geometry, 0xffff00, 0.005));
    mesh.add(line);
    mesh.children[0].visible = false;
    
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    _objects.push(mesh);
    _scene.add(mesh);
  }
  
   this.setMeshMaterial = function (mesh, material) {
    // console.log(mesh.material);
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
  GeometryBasic
}
import * as THREE from 'three'
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import {WireframeGeometry2} from "three/examples/jsm/lines/WireframeGeometry2";
import {Wireframe} from "three/examples/jsm/lines/Wireframe";
// import {Float32BufferAttribute} from 'three'


const GeometryBasic = function (_scene, _objects) {
  
  const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
  boxGeometry.translate(0, 0, 0.5);
  const boxEdges = new THREE.EdgesGeometry(boxGeometry);
  const boxLine = new THREE.LineSegments(boxEdges, new THREE.LineBasicMaterial({color: 0x000000}));
  // const boxNormals = [
  //   -0.5, -0.5, -0.5,
  //   0.5, -0.5, -0.5,
  //   0.5, 0.5, -0.5,
  //   -0.5, 0.5, -0.5,
  //
  //   -0.5, -0.5, 0.5,
  //   0.5, -0.5, 0.5,
  //   0.5, 0.5, 0.5,
  //   -0.5, 0.5, 0.5,
  // ];
  // boxGeometry.setIndex(boxIndices);
  // boxGeometry.setAttribute('position', new Float32BufferAttribute(boxVertices, 3));
  // boxGeometry.setAttribute('normal', new Float32BufferAttribute(boxVertices, 3));
  
  const scope = this;
  
  // API
  this.Box = function ([x, y, z], [w, h, d], material) {
    
    this.type = "box";
    let mesh = new THREE.Mesh(boxGeometry, material);
    
    mesh.scale.set(w, h, d);
    mesh.position.set(x, y, z);
    
    scope.sceneAddMesh(mesh, boxLine.clone())
    
    return mesh;
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
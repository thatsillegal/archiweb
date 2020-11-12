
import * as THREE from 'three';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {ColladaLoader} from "three/examples/jsm/loaders/ColladaLoader";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import {WireframeGeometry2} from "three/examples/jsm/lines/WireframeGeometry2";
import {Wireframe} from "three/examples/jsm/lines/Wireframe";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";

const Loader = function (_scene, _objects) {
  
  const manager = new THREE.LoadingManager();
  let buffer;
  
  function loadModel(object) {
    
    let lineGeometry = new THREE.BufferGeometry();
    
    const materials = new Set();
    const meshes = [];
    
    
    searchMaterials(object, materials);
    // console.log(materials)
    
    materials.forEach(function (material) {
      let meshGeometry = new THREE.Geometry();
      searchMaterialChild(material, object, meshGeometry);
      meshes.push(new THREE.Mesh(meshGeometry, material));
    });
    // console.log(meshes)
    
    buffer = new Float32Array();
    searchLines(object);
    // console.log(buffer);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(buffer, 3));
    const result = mergeMeshes(meshes);
    
    const line = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({color: 0x000000}));
    sceneAddMesh(result, line);
    return result;
  }
  
  function searchMaterials(object, materials) {
    if (object.isMesh) {
      if(object.material.length > 0) {
        materials.add(object.material[0]);
      } else {
        materials.add(object.material);
      }
      return;
    }
    if(object.isGroup) {
      for(let i = 0; i < object.children.length; ++ i) {
        searchMaterials(object.children[i], materials);
      }
    }
  }
  
  function mergeMeshes(meshes, toBufferGeometry) {
    if (meshes.length === 1) return meshes[0];
    
    var finalGeometry,
      materials = [],
      mergedGeometry = new THREE.Geometry(),
      mergedMesh;
    
    meshes.forEach(function (mesh, index) {
      mesh.updateMatrix();
      mesh.geometry.faces.forEach(function (face) {
        face.materialIndex = 0;
      });
      mergedGeometry.merge(mesh.geometry, mesh.matrix, index);
      materials.push(mesh.material);
    });
    
    mergedGeometry.groupsNeedUpdate = true;
    
    if (toBufferGeometry) {
      finalGeometry = new THREE.BufferGeometry().fromGeometry(mergedGeometry);
    } else {
      finalGeometry = mergedGeometry;
    }
    
    mergedMesh = new THREE.Mesh(finalGeometry, materials);
    mergedMesh.geometry.computeFaceNormals();
    mergedMesh.geometry.computeVertexNormals();
    
    return mergedMesh;
    
  }
  
  function meshLine(geometry, color, linewidth) {
    const matLine = new LineMaterial({color: color, linewidth: linewidth});
    const geoLine = new WireframeGeometry2(geometry);
    const wireframe = new Wireframe(geoLine, matLine);
    wireframe.computeLineDistances();
    wireframe.scale.set(1, 1, 1);
    console.log(wireframe)
    return wireframe;
  }
  
  function sceneAddMesh(mesh, line) {
    mesh.add(meshLine(mesh.geometry, 0xffff00, 0.005));
    mesh.add(line);
    mesh.children[0].visible = false;
    
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    _objects.push(mesh);
    _scene.add(mesh);
  }
  
  function Float32Concat(first, second) {
    let firstLength = first.length,
      result = new Float32Array(firstLength + second.length);
    
    result.set(first);
    result.set(second, firstLength);
    
    return result;
  }
  
  
  function searchLines(object, matrix) {
    if (matrix === undefined) matrix = new THREE.Matrix4();
    
    if (object.isLineSegments) {
      // console.log('----------------')
      // console.log(object.matrix);
      // console.log(object.scale)
      // console.log('---------------')
      object.geometry.applyMatrix4(matrix);
      
      const posArr = object.geometry.getAttribute('position').array;
      buffer = Float32Concat(buffer, posArr);
      return;
    }
    
    if (object.isGroup) {
      for (let i = 0; i < object.children.length; ++i) {
        searchLines(object.children[i],  object.matrix.premultiply(matrix));
      }
    }
  }
  
  
  function searchMaterialChild(material, object, meshGeometry, matrix) {
    if (matrix === undefined) matrix = new THREE.Matrix4();
    if (object.isMesh) {
      let omaterial = object.material;
      if (omaterial.length > 0) {
        omaterial = omaterial[0];
      }
      if (omaterial === material) {
        object.geometry = new THREE.Geometry().fromBufferGeometry(object.geometry);
        object.geometry.applyMatrix4(matrix);
        meshGeometry.merge(object.geometry, object.matrix);
      }
      return;
    }
    
    if (object.isGroup) {
      for (let i = 0; i < object.children.length; ++i) {
        searchMaterialChild(material, object.children[i], meshGeometry, object.matrix.premultiply(matrix));
      }
    }
  }
  
  this.loadModel = function (filename, mesh) {
    let extension = filename.split('.').pop().toLowerCase();
    let loader;
    const dracoLoader = new DRACOLoader();
    switch (extension) {
      case 'dae':
        loader = new ColladaLoader();
        loader.load(filename, function (collada) {
          
          mesh(loadModel(collada.scene));
          
        });
        break;
        
      case 'gltf':
      case 'glb':
        loader = new GLTFLoader();
        dracoLoader.setDecoderPath( 'three/examples/js/libs/draco/gltf/' );
        loader.setDRACOLoader( dracoLoader );
        loader.load(filename, function (gltf) {
          mesh(loadModel(gltf.scene));
        });
        break;
      case 'obj':
        loader = new OBJLoader();
        loader.load(filename, function(obj) {
          obj.rotateX(Math.PI/2);
          obj.scale.set(40, 40, 40);
          obj.updateMatrixWorld(true);
          mesh(loadModel(obj));
        });
        break;
      default:
        alert('file format not support');
    }
  }
  
  
  this.loadFile = function (file, mesh) {
    let filename = file.name;
    let extension = filename.split('.').pop().toLowerCase();
    let reader = new FileReader();
    reader.addEventListener('progress', function (event) {
      
      let size = '(' + Math.floor(event.total / 1000) + ' KB)';
      let progress = Math.floor((event.loaded / event.total) * 100) + '%';
      
      console.log('Loading', filename, size, progress);
      
    });
  
    const dracoLoader = new DRACOLoader();
    switch (extension) {
      case 'dae':
        reader.addEventListener('load', function (event) {
          
          let contents = event.target.result;
          
          let loader = new ColladaLoader(manager);
          let collada = loader.parse(contents);
  
          mesh(loadModel(collada.scene));
          
        }, false);
        reader.readAsText(file);
        break;
      
      case 'glb':
        reader.addEventListener('load', function (event) {
          
          let contents = event.target.result;
          let loader = new GLTFLoader();
          dracoLoader.setDecoderPath( 'three/examples/js/libs/draco/gltf/' );
          loader.setDRACOLoader( dracoLoader );
          let gltf = loader.parse(contents);
          
          mesh(loadModel(gltf.scene));
        }, false);
        reader.readAsText(file);
        break;
        
      case 'gltf':
        reader.addEventListener('load', function (event) {
    
          let contents = event.target.result;
          let loader = new GLTFLoader();
          if ( isGLTF1( contents ) ) {
    
            alert( 'Import of glTF asset not possible. Only versions >= 2.0 are supported. Please try to upgrade the file to glTF 2.0 using glTF-Pipeline.' );
    
          } else {
            dracoLoader.setDecoderPath('three/examples/js/libs/draco/gltf/');
            loader.setDRACOLoader(dracoLoader);
            loader.parse(contents, '', function (gltf) {
  
              mesh(loadModel(gltf.scene));
            });
  
          }
        }, false);
        reader.readAsText(file);
        break;
  
  
  
    }
  }
  
  function isGLTF1( contents ) {
    
    var resultContent;
    
    if ( typeof contents === 'string' ) {
      
      // contents is a JSON string
      resultContent = contents;
      
    } else {
      
      var magic = THREE.LoaderUtils.decodeText( new Uint8Array( contents, 0, 4 ) );
      
      if ( magic === 'glTF' ) {
        
        // contents is a .glb file; extract the version
        var version = new DataView( contents ).getUint32( 4, true );
        
        return version < 2;
        
      } else {
        
        // contents is a .gltf file
        resultContent = THREE.LoaderUtils.decodeText( new Uint8Array( contents ) );
        
      }
      
    }
    
    var json = JSON.parse( resultContent );
    
    return ( json.asset !== undefined && json.asset.version[ 0 ] < 2 );
    
  }
}


export {Loader};
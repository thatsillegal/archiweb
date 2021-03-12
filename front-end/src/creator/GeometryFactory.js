import * as THREE from 'three'
import {BufferGeometry, ShapeUtils} from 'three'
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import {WireframeGeometry2} from "three/examples/jsm/lines/WireframeGeometry2";
import {Wireframe} from "three/examples/jsm/lines/Wireframe";
import {Geometry, Face3} from "three/examples/jsm/deprecated/Geometry"


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
import {setMaterialDoubleSide, setPolygonOffsetMaterial} from "@/creator/MaterialFactory";

const GeometryFactory = function (_scene) {
  
  
  // Box Basic
  const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
  boxGeometry.translate(0, 0, 0.5);
  
  // Cylinder Basic
  const cylinderGeometry = new THREE.CylinderBufferGeometry(1, 1, 1, 32)
  cylinderGeometry.rotateX(Math.PI / 2);
  cylinderGeometry.translate(0, 0, 0.5);
  
  const planeGeometry = new THREE.PlaneBufferGeometry(1, 1);
  const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
  
  // const scope = this;
  // API
  this.Plane = function ([x, y, z] = [0, 0, 0], [w, d] = [1, 1], material, showEdge = true) {
    let mesh = new THREE.Mesh(planeGeometry, material);
    sceneAddMesh(_scene, mesh, showEdge);
    
    mesh.type = 'Plane';
    mesh.scale.set(w, d, 1);
    mesh.position.set(x, y, z);
    
    publicProperties(mesh);
    return mesh;
  }
  
  this.Cuboid = function ([x, y, z] = [0, 0, 0], [w, d, h] = [1, 1, 1], material, showEdge = true) {
    if (!material) material = new THREE.MeshPhongMaterial({color: 0xdddddd, specular: 0x111111, shininess: 1});
    let mesh = new THREE.Mesh(boxGeometry, material);
    sceneAddMesh(_scene, mesh, showEdge)
    
    mesh.type = 'Cuboid';
    mesh.scale.set(w, d, h);
    mesh.position.set(x, y, z);
    
    publicProperties(mesh);
    
    return mesh;
  }
  
  this.Sphere = function ([x, y, z] = [0, 0, 0], r = 1, material) {
    if (!material) material = new THREE.MeshPhongMaterial({color: 0xdddddd, specular: 0x111111, shininess: 1});
    let mesh = new THREE.Mesh(sphereGeometry, material);
    sceneAddMesh(_scene, mesh, false);
    
    mesh.type = 'Sphere';
    mesh.scale.set(r, r, r);
    mesh.position.set(x, y, z);
    
    publicProperties(mesh);
    return mesh;
  }
  
  this.Cylinder = function ([x, y, z] = [0, 0, 0], [r, h] = [1, 1], material, showEdge = false) {
    if (!material) material = new THREE.MeshPhongMaterial({color: 0xdddddd, specular: 0x111111, shininess: 1});
    let mesh = new THREE.Mesh(cylinderGeometry, material);
    sceneAddMesh(_scene, mesh, showEdge);
  
    mesh.type = 'Cylinder';
    mesh.scale.set(r, r, h);
    mesh.position.set(x, y, z);
  
    publicProperties(mesh);
    return mesh;
  }
  
  this.Vertices = function (points, size = 10) {
    const pointsMaterial = new THREE.PointsMaterial({color: 0xff0000, size: size,});
    let mesh = new THREE.Points(new BufferGeometry(), pointsMaterial);
    sceneAddMesh(_scene, mesh, false, false)
    
    mesh.type = 'Vertices';
    if (points) {
      mesh.geometry.setFromPoints(points);
      mesh.size = mesh.geometry.getAttribute('position').itemSize;
      mesh.coordinates = Array.from(mesh.geometry.getAttribute('position').array);
    }
    
    publicProperties(mesh);
    return mesh;
  }
  
  this.Segments = function (points, closed = false, color = 0x000, filled = false) {
    let segments;
    
    if (filled && closed) {
      const shape = new THREE.ShapeGeometry(new THREE.Shape().setFromPoints(points));
      segments = new THREE.Mesh(shape, new THREE.MeshPhongMaterial({color: color, specular: 0x111111, shininess: 1}))
      sceneAddMesh(_scene, segments, false);
    } else {
      if (closed) {
        segments = new THREE.LineLoop(
          new THREE.BufferGeometry(),
          new THREE.LineBasicMaterial({color: color})
        );
        
      } else {
        segments = new THREE.Line(
          new THREE.BufferGeometry(),
          new THREE.LineBasicMaterial({color: color})
        );
      }
      sceneAddMesh(_scene, segments, false, false, []);
    }
    
    segments.type = 'Segments';
    segments.closed = closed;
    if (points) {
      segments.geometry.setFromPoints(points);
      segments.size = segments.geometry.getAttribute('position').itemSize;
      segments.coordinates = Array.from(segments.geometry.getAttribute('position').array);
      segments.points = points;
    }
    publicProperties(segments);
    return segments;
  }
  
  
  /**
   * 2D shape to extruded geometry, set extruded = 0.0 to get a 2d polygon
   *
   * @param segments
   * @param material
   * @param height
   * @param extruded
   * @param showEdge
   * @returns {Mesh<ExtrudeGeometry, *>}
   * @constructor
   */
  this.Prism = function (segments, material, height = 0.0, extruded = 0.0, showEdge = false) {
    const shape = new THREE.Shape().setFromPoints(segments.points)
    
    const mesh = new THREE.Mesh(
      new THREE.ExtrudeGeometry(shape, {
        depth: 1.,
        bevelEnabled: false
      }),
      material
    );
    
    mesh.type = 'Prism';
    mesh.segments = segments;
    mesh.center = getPointsCenter(shape.getPoints());
    mesh.geometry.translate(-mesh.center.x, -mesh.center.y, 0);
    mesh.position.x = mesh.center.x;
    mesh.position.y = mesh.center.y;
    mesh.position.z = height;
    mesh.scale.z = extruded;
    sceneAddMesh(_scene, mesh, showEdge)
  
    publicProperties(mesh);
    return mesh;
  }
  
  this.Mesh = function (vertices, faces, material) {
    if (!material) material = new THREE.MeshPhongMaterial({color: 0xdddddd, side: THREE.DoubleSide});
    const geometry = new Geometry();
    
    geometry.vertices = coordinatesToPoints(vertices.coordinates, vertices.size);
    
    for (let i = 0; i < faces.count[0]; ++i) {
      geometry.faces.push(new Face3(faces.index[i * 3], faces.index[i * 3 + 1], faces.index[i * 3 + 2]));
    }
    
    geometry.computeBoundingBox();
    geometry.computeFaceNormals();
    geometry.normalsNeedUpdate = true;
    
    const mesh = new THREE.Mesh(geometry.toBufferGeometry(), material);
    mesh.type = 'Mesh';
    
    mesh.center = getPointsCenter(coordinatesToPoints(vertices.coordinates, vertices.size));
    mesh.geometry.translate(-mesh.center.x, -mesh.center.y, 0);
    mesh.position.x = mesh.center.x;
    mesh.position.y = mesh.center.y;
    
    sceneAddMesh(_scene, mesh);
    publicProperties(mesh);
    return mesh;
  }
  
  
  function getPointsCenter(points) {
    const v = new THREE.Vector3();
    points.forEach((pt) => {
      v.add(pt);
    })
    v.divideScalar(points.length);
    return v;
  }
  
  
  function updateModel(self, modelParam) {
    switch (self.type) {
      case 'Plane':
        self.scale.x = modelParam['w'];
        self.scale.y = modelParam['h'];
        break;
      case 'Cuboid' :
        self.scale.x = modelParam['w'];
        self.scale.y = modelParam['h'];
        self.scale.z = modelParam['d'];
        break;
      case 'Cylinder' :
        self.scale.x = modelParam['r'];
        self.scale.y = modelParam['r'];
        self.scale.z = modelParam['d'];
        break;
      case 'Sphere':
        self.scale.x = modelParam['r'];
        self.scale.y = modelParam['r'];
        self.scale.z = modelParam['r'];
        break;
      case 'Prism':
        self.segments = modelParam['segments'];
        self.shape = new THREE.Shape().setFromPoints(
          coordinatesToPoints(self.segments.coordinates, self.segments.size));
        self.geometry = new THREE.ExtrudeGeometry(self.shape, {depth: 1., bevelEnabled: false});
        self.position.z = modelParam['height'];
        self.scale.z = modelParam['extruded'];
        self.children[0] = createMeshWireframe(self, 0xffff00, 0.005)
        self.children[0].visible = false;
  
        self.center = getPointsCenter(self.shape.getPoints());
        self.geometry.translate(-self.center.x, -self.center.y, 0);
        self.position.x = self.center.x;
        self.position.y = self.center.y;
  
        break;
      case 'Segments':
        self.size = modelParam['size'];
        self.points = coordinatesToPoints(modelParam['coordinates'], self.size);
        self.closed = modelParam['closed'];
        self.geometry.setFromPoints(self.points);
        break;
      default:
        break;
    }
  }
  
  function modelParam(self) {
    switch (self.type) {
      case 'Vertices':
        self.size = self.geometry.getAttribute('position').itemSize
        self.coordinates = Array.from(self.geometry.getAttribute('position').array)
        return {size: self.size, coordinates: self.coordinates}
      case 'Segments':
        self.size = self.geometry.getAttribute('position').itemSize
        self.coordinates = Array.from(self.geometry.getAttribute('position').array)
        return {size: self.size, coordinates: self.coordinates, closed: self.closed};
      case 'Plane':
        return {w: self.scale.x, h: self.scale.y};
      case 'Cuboid':
        return {w: self.scale.x, h: self.scale.y, d: self.scale.z};
      case 'Cylinder':
        return {r: self.scale.x, d: self.scale.z};
      case 'Prism':
        return {segments: modelParam(self.segments), height: self.position.z, extrude: self.scale.z};
      case 'Sphere':
        return {r: self.scale.x};
      default:
        return {};
    }
  }
  
  
  function fromArchiJSON(self, element) {
    let m, scale, position, quaternion;
  
    switch (element.type) {
      case 'Cuboid':
      case 'Cylinder':
      case 'Plane':
      case 'Sphere':
        m = new THREE.Matrix4().fromArray(element.matrix);
        scale = new THREE.Vector3();
        position = new THREE.Vector3();
        quaternion = new THREE.Quaternion();
  
        m.decompose(position, quaternion, scale);
        self.quaternion.copy(quaternion);
        self.position.copy(position);
        self.scale.copy(scale);
        break;
      case 'Segments':
    
    }
  }
  
  function publicProperties(mesh) {
    
    mesh.updateModel = updateModel;
    mesh.modelParam = modelParam;
    mesh.fromArchiJSON = fromArchiJSON;
    
    mesh.exchange = true;
    mesh.toArchiJSON = function () {
      return Object.assign({
          type: mesh.type,
          matrix: mesh.matrix.elements,
          uuid: mesh.uuid,
          position: mesh.position
        },
        
        mesh.modelParam(mesh));
    }
    
    mesh.toInfoCard = function () {
      let o = mesh;
      window.InfoCard.info.uuid = o.uuid;
      window.InfoCard.info.position = o.position;
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
  
  /* ---------- Geometry Operator ---------- */
  function coordinatesToPoints(array, size) {
    const points = []
    const cnt = array.length / size;
    if (size === 2) {
      for (let i = 0; i < cnt; ++i) {
        points.push(new THREE.Vector2(array[i * 2], array[i * 2 + 1]))
      }
      
    } else if (size === 3) {
      for (let i = 0; i < cnt; ++i) {
        points.push(new THREE.Vector3(array[i * 3], array[i * 3 + 1], array[i * 3 + 2]))
      }
    }
    return points;
  }
  
  
  function pointsInsideSegments(segments, area) {
    let face = ShapeUtils.triangulateShape(segments.points, [])
    const ret = []
    for (let f of face) {
      let tri = [];
      for (let i = 0; i < 3; ++i) {
        tri.push(segments.points[f[i]])
      }
      let totArea = ShapeUtils.area(tri);
      pointsInsideTriangle(tri, parseInt(totArea / area), ret)
    }
    return ret;
  }
  
  function pointsInsideTriangle(triangle, num, pts) {
    for (let k = 0; k < num; ++k) {
      let coeff = []
      coeff.push(Math.random());
      coeff.push(Math.random() * (1 - coeff[0]));
      coeff.push(1 - coeff[0] - coeff[1])
      let pt = new THREE.Vector3();
      for (let i = 0; i < 3; ++i) {
        let v = new THREE.Vector3().copy(triangle[i]).multiplyScalar(coeff[i])
        pt.add(v)
      }
      pts.push(pt);
    }
  }
  
  // this.coordinatesToPoints = coordinatesToPoints;
  this.pointsInsideSegments = pointsInsideSegments;
  this.pointsInsideTriangle = pointsInsideTriangle;
  
}


function createMeshEdge(mesh, color = 0x000000) {
  if (!mesh.geometry) return;
  
  setPolygonOffsetMaterial(mesh.material);
  
  const matLine = new THREE.LineBasicMaterial({color: color});
  const geoLine = new THREE.EdgesGeometry(mesh.geometry);
  return new THREE.LineSegments(geoLine, matLine);
}

/**
 * create mesh wireframe with linewidth, must use specific LineMaterial in three@r0.121
 * @param mesh
 * @param color
 * @param linewidth
 * @returns {Wireframe}
 */
function createMeshWireframe(mesh, color = 0xffff00, linewidth) {
  
  setPolygonOffsetMaterial(mesh.material);
  
  const matLine = new LineMaterial({color: color, linewidth: linewidth});
  
  const geoLine = new WireframeGeometry2(mesh.geometry);
  const wireframe = new Wireframe(geoLine, matLine);
  wireframe.computeLineDistances();
  wireframe.scale.set(1, 1, 1);
  return wireframe;
}

function sceneMesh(object, shadow = true, doubleSide = false, layer = [0]) {
  object.traverseVisible((mesh) => {
    mesh.layer = layer;
    console.log(mesh)
    if (shadow) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
    if (mesh.isMesh) {
      if (doubleSide) {
        setMaterialDoubleSide(mesh.material);
      }
      mesh.add(createMeshWireframe(mesh, 0xffff00, 0.005));
      mesh.children[0].visible = false;
      mesh.layer = [0];
    }
  });
}

/**
 * add a new mesh to a object3D (scene, group)
 * @param object
 * @param mesh
 * @param edge
 * @param shadow
 * @param layer
 */
function sceneAddMesh(object, mesh, edge = true, shadow = true, layer = [0]) {
  // show edge
  if (mesh.isMesh) {
    setPolygonOffsetMaterial(mesh.material);
    mesh.add(createMeshWireframe(mesh, 0xffff00, 0.005));
    mesh.children[0].visible = false;
  }
  
  if (edge.isLineSegments) {
    mesh.add(edge);
  } else if (edge === true) {
    mesh.add(createMeshEdge(mesh));
  }
  // show shadow
  if (shadow) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  }
  
  // layer, default is [0]
  mesh.layer = layer;
  object.add(mesh);
}

export {
  GeometryFactory,
  sceneMesh,
  sceneAddMesh,
  createMeshWireframe,
  createMeshEdge
};

const MaterialFactory = function () {

}
function setMaterial (mesh, material) {
  if (mesh.material.length > 0) {
    let materials = []
    mesh.material.forEach(() => materials.push(material));
    mesh.material = materials;
  } else {
    mesh.material = material;
  }
  
}

function setMaterialOpacity(material, opacity) {
  if(material === undefined) return;
  if(material.length > 0) {
    material.forEach((item) => {
      setMaterialOpacity(item, opacity);
    })
  }
  
  material.transparent = true;
  material.opacity = opacity;
}

function setPolygonOffsetMaterial(material) {
  if(material === undefined) return;
  if(material.length > 0) {
    material.forEach((item) => {
      setPolygonOffsetMaterial(item);
    })
  }
  
  material.polygonOffset = true;
  material.polygonOffsetFactor = 1.0;
  material.polygonOffsetUnits = 1.0;
}

export {
  MaterialFactory as default,
  setMaterial,
  setMaterialOpacity,
  setPolygonOffsetMaterial,
}
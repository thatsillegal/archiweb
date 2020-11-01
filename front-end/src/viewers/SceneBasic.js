import * as THREE from 'three'

const SceneBasic = function (_scene) {
  
  const matFloor = new THREE.MeshPhongMaterial({color: 0xb8b9b4, depthWrite: false});
  const geoFloor = new THREE.PlaneBufferGeometry(20000, 20000);
  const mshFloor = new THREE.Mesh(geoFloor, matFloor);
  
  
  function init() {
    mshFloor.receiveShadow = true;
    mshFloor.position.set(0, -0.05, 0);
    _scene.add(mshFloor);
    
    
    _scene.background = new THREE.Color(0xc0c0c0);
    _scene.fog = new THREE.Fog(0xc0c0c0, 100, 5000);
    
    
    // const hemiLight = new THREE.HemisphereLight( 0xc0c0c0, 0x111111 );
    // hemiLight.position.set( 0, 1000, 0 );
    // _scene.add( hemiLight );
    
    
    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(-0, -400, 500);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -25;
    dirLight.shadow.camera.left = -25;
    dirLight.shadow.camera.right = 25;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.set(1024, 1024);
    _scene.add(dirLight);
    
    // _scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );
    // _scene.add( new THREE.DirectionalLightHelper(dirLight));
    
  }
  
  init();
  
  this.floor = mshFloor;
  
};


export {SceneBasic};
// /* eslint-disable no-unused-vars */
import * as THREE from 'three'


const SceneBasic = function (_scene, _renderer) {
  let scope = this;
  this.floorColor = '#898970';
  this.skyColor = '#bddbdb';
  
  const matFloor = new THREE.MeshPhongMaterial({color: scope.floorColor, depthWrite: false});
  const geoFloor = new THREE.PlaneBufferGeometry(20000, 20000);
  const mshFloor = new THREE.Mesh(geoFloor, matFloor);
  
  let gridHelper = new THREE.GridHelper(1000, 20);
  let axesHelper = new THREE.AxesHelper(5000);
  
  
  
  function init() {
    mshFloor.receiveShadow = true;
    mshFloor.position.set(0, 0, 0);
    _scene.add(mshFloor);
    
    
    skyColorUpdate();

    
    
    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(200, -400, 500);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -25;
    dirLight.shadow.camera.left = -25;
    dirLight.shadow.camera.right = 25;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.set(10240, 10240);
    _scene.add(dirLight);
    
    _scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );
    _scene.add( new THREE.DirectionalLightHelper(dirLight));
    
    _renderer.outputEncoding = THREE.sRGBEncoding;
    _renderer.shadowMap.enabled = true;
    _renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    gridUpdate();
    axesUpdate();
  }
  
  function axesUpdate(toggle) {
    if (toggle === false)
      _scene.remove(axesHelper);
    else
      _scene.add(axesHelper);
  }
  
  function gridUpdate(size) {
    _scene.remove(gridHelper);
    if (size > 0) {
      gridHelper = new THREE.GridHelper(20 * size, 20);
      gridHelper.rotateX(Math.PI / 2.0);
      _scene.add(gridHelper);
    }
  }
  
  function skyColorUpdate() {
    _scene.background = new THREE.Color(scope.skyColor);
    _scene.fog = new THREE.Fog(scope.skyColor, 100, 10000);
  
  }
  

  function addGUI(gui) {
    let sceneBasic = gui.addFolder('Scene Basic')
    sceneBasic.open();
    sceneBasic.add(scope, 'axes')
      .listen().onChange(
      function () {
        axesUpdate(scope.axes);
      }
    );
    sceneBasic.add(scope, 'grid').min(0).max(500).step(10)
      .listen().onChange(
      function () {
        gridUpdate(scope.grid);
      }
    );
    sceneBasic.addColor(scope, 'skyColor').name('sky').onChange(function() {
      skyColorUpdate(scope.skyColor);
    });
    sceneBasic.addColor(scope, 'floorColor').name('floor').onChange(function () {
      mshFloor.material.color = new THREE.Color(scope.floorColor);
    });
  }
  init();
  
  // APIs
  this.floor = mshFloor;
  this.axes = true;
  this.grid = 0;
  this.addGUI = addGUI;
};


export {SceneBasic};
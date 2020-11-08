// /* eslint-disable no-unused-vars */
import * as THREE from 'three'


const SceneBasic = function (_scene, _renderer) {
  let scope = this;
  this.floorColor = '#898970';
  this.skyColor = '#bddbdb';
  this.x = 400;
  this.y = -700;
  this.z = 400;
  
  const matFloor = new THREE.MeshPhongMaterial({color: scope.floorColor, depthWrite: false});
  const geoFloor = new THREE.PlaneBufferGeometry(20000, 20000);
  const mshFloor = new THREE.Mesh(geoFloor, matFloor);
  const dirLight = new THREE.DirectionalLight(0xffffff);
  
  let gridHelper = new THREE.GridHelper(1000, 20);
  let axesHelper = new THREE.AxesHelper(5000);
  
  let _control;
  
  
  function init() {
    mshFloor.receiveShadow = true;
    mshFloor.position.set(0, 0, -0.5);
    _scene.add(mshFloor);
    
    
    skyColorUpdate();
    
    _scene.add(new THREE.AmbientLight(0x444445));
    
    
    dirLight.position.set(scope.x, scope.y, scope.z);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 5000;
    dirLight.shadow.camera.bottom = -2500;
    dirLight.shadow.camera.left = -2500;
    dirLight.shadow.camera.right = 2500;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 8000;
    dirLight.shadow.mapSize.set(10240, 10240);
    _scene.add(dirLight);
    
    // _scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );
    // _scene.add( new THREE.DirectionalLightHelper(dirLight));
    
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
      gridHelper = new THREE.GridHelper(20 * size, 20, 0x222222, 0x444444);
      gridHelper.rotateX(Math.PI / 2.0);
      _scene.add(gridHelper);
    }
  }
  
  function skyColorUpdate() {
    _scene.background = new THREE.Color(scope.skyColor);
    _scene.fog = new THREE.Fog(scope.skyColor, 1000, 10000);
    
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
    sceneBasic.add(scope, 'shadow')
      .listen().onChange(function () {
      dirLight.castShadow = scope.shadow;
    });
    sceneBasic.add(scope, 'grid').min(0).max(500).step(10)
      .listen().onChange(
      function () {
        gridUpdate(scope.grid);
        if (_control === undefined) return;
        
        if (scope.grid > 0) {
          _control.setTranslationSnap(scope.grid);
          _control.setRotationSnap(THREE.MathUtils.degToRad(15));
          _control.setScaleSnap(0.25);
        } else {
          _control.setTranslationSnap(null);
          _control.setRotationSnap(null);
          _control.setScaleSnap(null);
        }
      }
    );
    sceneBasic.addColor(scope, 'skyColor').name('sky').onChange(function () {
      skyColorUpdate(scope.skyColor);
    });
    sceneBasic.addColor(scope, 'floorColor').name('floor').onChange(function () {
      mshFloor.material.color = new THREE.Color(scope.floorColor);
    });
    let sun = sceneBasic.addFolder('Sun Position')
    sun.add(scope, 'x').min(-2000).max(2000).step(10).onChange(function () {
      dirLight.position.x = scope.x;
    });
    sun.add(scope, 'y').min(-1500).max(200).step(10).onChange(function () {
      dirLight.position.y = scope.y;
    });
    sun.add(scope, 'z').min(0).max(3000).step(10).onChange(function () {
      dirLight.position.z = scope.z;
    });
  }
  
  function setControl(control) {
    _control = control;
  }
  
  init();
  
  // APIs
  this.floor = mshFloor;
  this.axes = true;
  this.shadow = true;
  this.grid = 0;
  this.addGUI = addGUI;
  this.setControl = setControl;
};


export {SceneBasic};
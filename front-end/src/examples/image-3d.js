import * as THREE from "three";
import * as ARCH from "@/archiweb"

let scene, renderer, gui;
// let geoFty, matFty;

function getImageData( image ) {
  
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  
  const context = canvas.getContext('2d');
  context.drawImage( image, 0, 0 );
  
  return context.getImageData( 0, 0, image.width, image.height );
  
}

function getPixel( imagedata, x, y ) {
  
  const position = (x + imagedata.width * y) * 4, data = imagedata.data;
  return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ], a: data[ position + 3 ] };
  
}

function getIllumination(pixel) {
  const i = 0.3 * pixel.r + 0.59 * pixel.g + 0.11 * pixel.b;
  return i * (pixel.a/255.0);
}
/* ---------- GUI setup ---------- */
function initGUI() {
  const control = {
    import:function () {
      fileInput.click();
    }
  }
  
  gui.add(control, 'import');
  
  let form = document.createElement('form');
  form.style.display = 'none';
  document.body.appendChild(form);
  
  let fileInput = document.createElement('input');
  fileInput.multiple = true;
  fileInput.type = 'file';
  fileInput.addEventListener('change', function () {
    let reader = new FileReader();
    reader.addEventListener('load', function(event){
      console.log(event);
      let contents = event.target.result;
      const loader = new THREE.ImageLoader();
      loader.load(
        // resource URL
        contents,
    
        // onLoad callback
        function ( image ) {
          // use the image, e.g. draw part of it on a canvas
          let imagedata = getImageData(image);
          let color = getPixel( imagedata, 10, 10 );
          let i = getIllumination(color);
  
          console.log(color);
          console.log(i);
        },
    
        // onProgress callback currently not supported
        undefined,
    
        // onError callback
        function () {
          console.error( 'An error happened.' );
        }
      );
    })
    reader.readAsDataURL(fileInput.files[0]);

    form.reset();
    
  });
  form.appendChild(fileInput);
}


/* ---------- create your scene object ---------- */
function initScene() {
  // geoFty = new ARCH.GeometryFactory(scene);
  // matFty = new ARCH.MaterialFactory();
  
  
  
  // refresh global objects
  ARCH.refreshSelection(scene);
}


/* ---------- animate per frame ---------- */
function draw() {

}


/* ---------- main entry ---------- */
function main() {
  const viewport = new ARCH.Viewport();
  renderer = viewport.renderer;
  scene = viewport.scene;
  gui = viewport.gui.gui;
  
  viewport.enableDragFrames();
  viewport.enableTransformer();
  
  initScene();
  
  viewport.draw = draw;
  
  const sceneBasic = new ARCH.SceneBasic(scene, renderer);
  sceneBasic.addGUI(gui);
  initGUI();
}

export {
  main
}
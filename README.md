# ArchiWeb
ArchiWeb is a front-end web application using [Vuetify](https://vuetifyjs.com/en/) and [three.js](https://threejs.org/). It's recommanded to start from the documentations of both.

## Usage
ArchiWeb provides a template to create a web application from scratch, you can easily use [Vuetify UI components](https://vuetifyjs.com/en/components/buttons/) to generate a material design web, also with 3d rendering.
### Install
``` bash
git clone https://github.com/Inst-AAA/archiweb.git
cd archiweb/front-end

# install dependencies
npm install

# run server
npm run server
```

check out to specific branch, such as:
``` bash
git checkout -b java-backend
```
or you can just mannually organize and use those plugins.

### Tools
#### GUI
ArchiWeb use `dat.gui` create simple interacts
``` javascript
const gui = require('@/viewers/3D/gui')
gui.initGUI();

// Add variable
const controls = new function() {
  this.variable = 0;
  this.color = 0x666600;
  this.select = 'aaa';
  this.change = true;

  this.button = function() {
    // do something
  }
}

// slider
gui.gui.add(controls, 'variable', 0, 10, 1);

// color picker
gui.gui.addColor(controls, 'color');

// select list
gui.gui.add(control, 'select', ['aaa', 'bbb', 'ccc'])

// button
gui.gui.add(button);

// Add your folder
const folder = gui.gui.addFolder('Folder name');
folder.add(controls, 'change');

// onChange and listen
gui.gui.add(controls, 'change').listen().onChange(function() {
  // do something
});
```

#### Transformer
Transform tool derive from THREE.TransformControl, Like Rhino Gumball
- init a transformer and add gui
``` javascript
sceneBasic = new SceneBasic(scene, renderer, transformer);
sceneBasic.addGUI(gui.gui);
```
#### DragFrames
Multiselect tools
- draw rectangle over current renderer
```javascript
dragFrames = new DragFrames(objects, camera, scene, renderer);

// Disable autoClear
renderer.autoClear = false;

// Your render function
function render() {
renderer.clear();
renderer.render(scene, camera);

if (dragFrames !== undefined)
  dragFrames.render();
}

```

- highlight seleted objects
``` javascript
dragFrames.addEventListener('select', function (event) {
  for (let i = 0; i < event.object.length; ++i) {
    event.object[i].material.emissive.set(0x666600);
    if (event.object[i].children.length > 0)
      event.object[i].children[0].visible = true;
  }
});

dragFrames.addEventListener('selectup', function (event) {
  for (let i = 0; i < event.object.length; ++i) {
    event.object[i].material.emissive.set(0x000000);
    if (event.object[i].children.length > 0)
      event.object[i].children[0].visible = false;
  }
});
```
- work with transformer
``` javascript
transformer.setDragFrames(dragFrames); //If not init with DragFrames

dragFrames.addEventListener('selectdown', function(event) {
  transformer.clear();
});


dragFrames.addEventListener('selectup', function (event) {

  transformer.setSelected(event.object);
});

```

#### MultiCamera

## Branchs
### java-backend
Data exchange format is [ArchiJson](https://github.com/Inst-AAA/archijson).

### webxr
It's plan to support VR, which is a better display to architectural design.

### database
To be the front-end of [ArchiBase](https://github.com/Inst-AAA/archibase)

### ddg
code from [cmu-geometry/ddg-exercises-js](https://github.com/cmu-geometry/ddg-exercises-js) 

support:  
1. Linear Algebra (wrap from [Eigen](https://eigen.tuxfamily.org/))
2. HalfEdges
3. Discrete Differential Geometry Processing

## Issues

/* eslint-disable no-unused-vars,no-case-declarations */
import mapboxgl from 'mapbox-gl';
import * as dat from 'dat.gui';
import {my_accesstoken} from "@/testdata";
import * as ARCH from "@/archiweb";
import * as THREE from 'three';

let gui, util, map;

mapboxgl.accessToken = 'your_token';
mapboxgl.accessToken = my_accesstoken;
//
let control = {
  randomCenter: function () {
    let center = map.getCenter();
    let dx = Math.random() * 0.02 - 0.01;
    let dy = Math.random() * 0.02 - 0.01;
    map.flyTo({
      center: [center.lng + dx, center.lat + dy],
      essential: true
    });

  },
  getAABB: function () {
    let bbox = [[16.371658895495273, 48.20703295326334], [16.37303218651013, 48.207855212279554]]
    let range = [];
    bbox.forEach((p) => {
      range.push(mousePos(map.project(p)))
    });
    let features = map.queryRenderedFeatures(range, {
      layers: ['building']
    });

    // add one layer and source
    let feature = JSON.parse(JSON.stringify(features[0]));
    feature.toJSON = features[0].toJSON;
    feature.geometry.coordinates = [];
    for (let i = 0; i < features.length; ++i) {
      feature.geometry.coordinates.push(features[i].geometry.coordinates);
    }
    feature.geometry.type = 'MultiPolygon';
    highlightBuilding(feature, '-aabb');

    // add multiple layer and source
    // for (let i = 0; i < features.length; ++i) {
    //   highlightBuilding(features[i], 'h' + i.toString());
    // }
  },
  show3D: false
}


// function initGUI() {
//   gui = new dat.GUI({autoPlace: false});
//
//   util = gui.addFolder('Utils');
//   util.add(control, 'randomCenter').name('center');
//   util.add(control, 'getAABB').name('getAABB');
//   util.add(control, 'show3D').onChange(() => {
//     if (control.show3D) {
//       map.addLayer(
//         {
//           'id': '3d-buildings',
//           'source': 'composite',
//           'source-layer': 'building',
//           'filter': ['==', 'extrude', 'true'],
//           'type': 'fill-extrusion',
//           'minzoom': 16.6,
//           'paint': {
//             'fill-extrusion-color': '#aaa',
//
//             'fill-extrusion-height': [
//               'interpolate',
//               ['linear'],
//               ['zoom'],
//               16.99,
//               0,
//               17.04,
//               ['get', 'height']
//             ],
//             'fill-extrusion-base': [
//               'interpolate',
//               ['linear'],
//               ['zoom'],
//               16.99,
//               0,
//               17.04,
//               ['get', 'min_height']
//             ],
//             'fill-extrusion-opacity': 0.96
//           },
//         },
//       );
//
//     } else {
//       map.removeLayer('3d-buildings')
//     }
//   })
//   util.open();
//
//   const container = document.getElementById('gui-container');
//   container.appendChild(gui.domElement);
// }


function mousePos(e) {
  let canvas = map.getCanvasContainer();
  let rect = canvas.getBoundingClientRect();
  
  // e.x = Math.max(0, e.x);
  // e.y = Math.max(0, e.y);
  // e.x = Math.min(rect.width + rect.left + canvas.clientLeft + canvas.clientWidth, e.x);
  // e.y = Math.min(rect.height + rect.top + canvas.clientTop + canvas.clientHeight, e.y);
  

  return new mapboxgl.Point(
    e.x - rect.left - canvas.clientLeft,
    e.y - rect.top - canvas.clientTop
  )
}

function highlightBuilding(feature, id = '') {
  if (typeof map.getLayer('building-highlighted' + id) !== "undefined" &&
    map.getSource('building-highlighted' + id)._data.id !== feature.id) {
    map.removeLayer('building-highlighted' + id)
    map.removeSource('building-highlighted' + id);
    
  }
  
  if (typeof map.getLayer('building-highlighted' + id) === "undefined") {
    map.addSource('building-highlighted' + id, {
      "type": "geojson",
      "data": feature.toJSON()
    });
  }
  
  if (typeof map.getLayer('building-highlighted' + id) === "undefined") {
    map.addLayer({
        'id': 'building-highlighted' + id,
        'type': 'fill',
        'source': 'building-highlighted' + id,
        'paint': {
          'fill-outline-color': '#795547',
          'fill-color': '#795547',
          'fill-opacity': 1,
        },
      }
    )
  }
}

/* ---------- main entry ---------- */
function main() {
  
  map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/amomorning/ckn77mtlw04ed17o3a7s1q2yn', // style URL
    center: [16.373, 48.208], // starting position [lng, lat]
    minZoom: 12,
    maxZoom: 17.5,
    zoom: 16,
    antialias: true
  });
  
  map.addControl(new mapboxgl.FullscreenControl(), 'bottom-left');
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
  map.on('load', () => {
    
    map.on('mousemove', function (e) {
        if (!control.show3D) {
          let feature = map.queryRenderedFeatures(e.point, {layers: ['building']})[0];
          console.log(feature);
          if (feature === undefined ) {
            if (typeof map.getLayer('building-highlighted') !== "undefined") {
              map.removeLayer('building-highlighted')
            }
            if (typeof map.getSource('building-highlighted') !== "undefined") {
              map.removeSource('building-highlighted')
            }
          } else {
            
            if(feature.id !== undefined) {
              let range = []
              let canvas = map.getCanvasContainer();
              range.push(new mapboxgl.Point(0, 0));
              range.push(new mapboxgl.Point(canvas.clientWidth, canvas.clientWidth))
              let sameid = map.queryRenderedFeatures(range, {layers:['building']});
              let coords = feature.geometry.coordinates;
              feature.geometry.coordinates = [coords];
  
              for (let i = 0; i < sameid.length; ++ i) {
                if(sameid[i].id === feature.id) {
      
                  if(sameid[i].geometry.type === 'MultiPolygon') {
                    for(let j = 0; j < sameid[i].geometry.coordinates.length; ++ j) {
                      feature.geometry.coordinates.push(sameid[i].geometry.coordinates[j]);
                    }
        
                  } else {
                    feature.geometry.coordinates.push(sameid[i].geometry.coordinates);
                  }
                }
              }
              feature.geometry.type = 'MultiPolygon';
              
            }
            
            console.log(feature);
            highlightBuilding(feature);
            
          }
          
        }
      }
    );
    
    // map.on('click', function (e) {
    //   console.log(e.lngLat);
    //   console.log(map.unproject(e.point));
    // })
  })
  
}

export {
  main
}

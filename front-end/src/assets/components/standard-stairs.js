import * as ARCH from "@/archiweb";

const stairpara = {
  w: 300,
  h: 50,
}
let stairs = [];


const create_stair = function (scene, gui) {
  let gf = new ARCH.GeometryFactory(scene);
  let mt = new ARCH.MaterialFactory();
  
  
  for (let i = 0; i < 10; ++i) {
    stairs.push(gf.Cuboid([0, i * 50, i * 30], [300, 50, 50], mt.Matte()));
  }
  for (let i = 0; i < 10; ++i) {
    stairs.push(gf.Cuboid([300, 450 - i * 50, i * 30 + 330], [300, 50, 50], mt.Matte()));
  }
  
  
  gf.Cuboid([150, 650, 300], [600, 350, 50], mt.Matte());
  gui.gui.add(stairpara, "w", 100, 500, 30).onChange(function () {
    stairs.forEach((ele) => {
      ele.scale.x = stairpara.w;
    })
  });
  gui.gui.add(stairpara, "h", 10, 100, 5).onChange(function () {
    stairs.forEach((ele) => {
      ele.scale.z = stairpara.h;
    })
  });
}

export {
  create_stair
}
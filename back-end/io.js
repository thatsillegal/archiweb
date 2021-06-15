exports.createSocketIO = function (server) {
  
  const date = new Date();
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  const rooms = io.of('/').adapter.rooms;
  const keyuid = {'cb792abe-c615-45f9-9b64-e9d95ce2dd94': 'amomorning'}
  
  io.on('connection', (socket) => {
    console.info(date.toLocaleString(), `Client connected [id=${socket.id}]`);
    socket.on('register', async function (data) {
      console.info(date.toLocaleString(), `Client [id=${socket.id}] registered :)`);
      if (typeof (data) === "string")
        data = JSON.parse(data);
      // data = JSON.parse(data);
      console.log(socket.id);
      console.log(data);
      console.log(keyuid[data.key])
      socket.join(keyuid[data.key])
      console.log(socket.rooms)
      socket.uid = keyuid[data.key];
    });
    
    socket.on('disconnect', async function () {
      console.info(date.toLocaleString(), `Client [id=${socket.id}] disconnect :)`);
    });
    
    socket.on('bts:sendGeometry', async function (data) {
      console.log(date.toLocaleString(), 'bts:sendGeometry: ' + data);
      data.id = socket.id;
      //
      // console.log('bts:' + data.app + 'ReceiveGeometry')
      // io.emit('bts:' + data.app + 'ReceiveGeometry', data);
      console.log(socket.rooms);
      console.log(socket.uid);
      console.log(rooms);
      
    });
    
    socket.on('stb:sendGeometry', async function (data) {
      data = JSON.parse(data);
      console.log(date.toLocaleString(), 'stb:sendGeometry');
      io.to(data.id).emit('stb:receiveGeometry', data.geometryElements);
    });
  });
}

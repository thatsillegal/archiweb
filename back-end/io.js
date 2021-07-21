const userController = require('./controllers/users');
const connController = require('./controllers/connections')


exports.createSocketIO = function (server) {
  
  
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  const date = new Date();
  
  io.on('connection', (socket) => {
    console.info(date.toLocaleString(), `Client connected [id=${socket.id}]`);
    socket.on('register', async function (data, callback) {
  
  
      if (typeof (data) === "string")
        data = JSON.parse(data);
  
      try {
        let username = await userController.findUsername(data.token);
        let identity = data.identity;
        socket.join(username + '-' + identity);
        socket.uid = username;
  
        await connController.insert(data.token, data.identity, socket.id);
  
        console.info(date.toLocaleString(), `Client [id=${socket.id}] registered.`);
        callback({
          status: 'register: OK'
        });
  
      } catch (e) {
        console.log(e);
        callback({
          status: 'Error'
        });
      }
    });
    
    socket.on('disconnect', async function () {
      await connController.update(socket.id, false);
      console.info(date.toLocaleString(), `Client [id=${socket.id}] disconnect.`);
    });
    
    socket.on('exchange', async function (data, callback) {
  
      if (typeof (data) === "string")
        data = JSON.parse(data);
  
      let room = socket.uid + '-' + data.to;
      if (data.id) room = data.id;
  
      console.info(date.toLocaleString(), `Client [id=${socket.id}] exchange data to ${room}.`);
  
      io.to(room).emit('receive', {id: socket.id, body: data.body});
  
      callback({
        status: 'exchange: OK'
      })
    });
    
    
    socket.on('bts:sendGeometry', async function (data) {
      console.log(date.toLocaleString(), 'bts:sendGeometry: ' + data);
      data.id = socket.id;
      //
      // console.log('bts:' + data.app + 'ReceiveGeometry')
      // io.emit('bts:' + data.app + 'ReceiveGeometry', data);
      
    });
    
    socket.on('stb:sendGeometry', async function (data) {
      data = JSON.parse(data);
      console.log(date.toLocaleString(), 'stb:sendGeometry');
      io.to(data.id).emit('stb:receiveGeometry', data.geometryElements);
    });
  });
}

const ConnModel = require('../model/connections')
const APIAuthModel = require('../model/apiauth')

exports.insert = async function (token, identity, socket) {
  try {
    let ret = await new ConnModel({
      token: token,
      identity: identity,
      socket: socket
    }).save();
  
    // console.log(ret);
    return {code: 200, message: "OK", id: ret._id};
  
  } catch (e) {
    console.log('INSERT CONNECTIONS:' + e)
    return {code: 503, message: "Error insert connection"}
  }
}
exports.reboot = async function () {
  try {
  
    ConnModel.find({alive: true}, function (err, connections) {
      if (err) return {
        code: 503,
        message: "error"
      }
      for (let conn of connections) {
        conn.set({alive: false});
        conn.save()
      }
    })
    return {code: 200, message: "OK"};
  } catch (e) {
    console.log(e)
    return {code: 503, message: "Error"};
  }
}

exports.update = async function (socket, alive) {
  try {
    ConnModel.findOne({socket: socket}, function (err, connections) {
      if (err || connections === null) return {
        code: 503,
        message: "error"
      }
      connections.set({alive: alive});
      connections.save();
    })
    return {code: 200, message: "OK"};
  } catch (e) {
    console.error(e)
    return {code: 503, message: "Error"}
  }
}

exports.queryAlive = async function (token) {
  return ConnModel.find({token: token, alive: true});
}

exports.queryAll = async function (token) {
  return ConnModel.find({token: token});
}


exports.findAlive = async function (username) {
  let tokens = await APIAuthModel.find({username: username});
  // console.log(tokens);
  
  let ret = []
  
  for (let t of tokens) {
    let connections = await this.queryAlive(t.token);
    ret.push({token: t.token, count: connections.length, connections: connections});
  }
  return ret;
}

exports.findAll = async function (username) {
  let tokens = await APIAuthModel.find({username: username});
  // console.log(tokens);
  let ret = []
  
  for (let t of tokens) {
    let connections = await this.queryAll(t.token);
    ret.push({token: t.token, count: connections.length, connections: connections});
  }
  return ret;
}

exports.count = async function (token, alive = false) {
  if (alive) {
    return ConnModel.countDocuments({token: token, alive: true});
  } else {
    return ConnModel.countDocuments({token: token});
  }
}

exports.list = async function (page = 1, limit = 10) {
  let skip = (page - 1) * limit;
  return ConnModel.find().skip(skip).limit(limit);
}
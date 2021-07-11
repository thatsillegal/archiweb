const ConnModel = require('../model/connections')
const APIAuthModel = require('../model/apiauth')

exports.insert = async function (token, identity, socket) {
  try {
    let ret = await new ConnModel({
      token: token,
      identity: identity,
      socket: socket
    }).save();
    return {code: 200, message: "OK", id: ret._id};
    
  } catch (e) {
    console.log(e)
    return {code: 503, message: "Error insert connection"}
  }
}
exports.reboot = async function () {
  ConnModel.find({alive: true}, function (err, conns) {
    if (err) return {
      code: 503,
      message: "error"
    }
    for (let conn of conns) {
      conn.set({alive: false});
      conn.save().then(r => console.log('r:' + r))
    }
  })
  return {code: 200, message: "OK"};
}

exports.update = async function (socket, alive) {
  ConnModel.findOne({socket: socket}, function (err, conns) {
    if (err) return {
      code: 503,
      message: "error"
    }
    conns.set({alive: alive});
    conns.save().then(r => console.log('r:' + r))
  })
  return {code: 200, message: "OK"};
}

exports.queryAlive = async function (token) {
  let conns = await ConnModel.find({token: token, alive: true});
  return conns;
}

exports.queryAll = async function (token) {
  let conns = await ConnModel.find({token: token});
  return conns;
}


exports.findAlive = async function (username) {
  let tokens = await APIAuthModel.find({username: username});
  // console.log(tokens);
  
  let ret = []
  
  for (let t of tokens) {
    let conns = await this.queryAlive(t.token);
    ret.push({token: t.token, count: conns.length, connections: conns});
  }
  return ret;
}

exports.findAll = async function (username) {
  let tokens = await APIAuthModel.find({username: username});
  // console.log(tokens);
  let ret = []
  
  for (let t of tokens) {
    let conns = await this.queryAll(t.token);
    ret.push({token: t.token, count: conns.length, connections: conns});
  }
  return ret;
}

exports.list = async function (page = 1, limit = 10) {
  let skip = (page - 1) * limit;
  return ConnModel.find().skip(skip).limit(limit);
}
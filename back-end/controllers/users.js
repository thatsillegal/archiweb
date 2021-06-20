const UserModel = require('../model/users');
const APIAuthModel = require('../model/apiauth');

exports.list = async function () {
  let users = await UserModel.find().limit(10);
  console.log(users);
  return users;
}

// construct a doc
exports.insert = function (username, password, sid) {
  new UserModel({
    username: username,
    password: password,
    sid: sid
  }).save().then(r => console.log(r));
  new APIAuthModel({
    username: username
  }).save().then(r => console.log(r));
}

exports.createToken = function (username, description) {
  new APIAuthModel({
    username: username,
    description: description
  }).save().then(r => console.log(r));
}


// querying
exports.find = async function (username) {
  let user = await UserModel.findOne({username: username});
  let tokens = await APIAuthModel.find({username: username});
  
  return {user: user, tokens: tokens};
}


exports.findUsername = async function (token) {
  let username = await APIAuthModel.findOne({token: token});
  return username.username;
}

// update


// deleting
exports.deleteToken = function (token) {
  APIAuthModel.deleteOne({token: token}, err => {
    if (err) return {
      code: 503,
      message: "deleting error"
    }
  })
}

exports.deleteUser = function (username) {
  APIAuthModel.deleteMany({username: username}, err => {
    if (err) {
      console.error(err);
      return {
        code: 503,
        message: "deleting user token error"
      }
    }
  })
  
  UserModel.deleteOne({username: username}, err => {
    if (err) {
      console.log(err);
      return {
        code: 503,
        message: "deleting user error"
      }
    }
  })
}


// validation
exports.login = async function (username, password) {
  const user = await UserModel.findOne({username: username});
  
  if (!user) {
    return {
      code: 422,
      message: "user not found"
    }
  }
  const checkPassword = require('bcryptjs').compareSync(
    password,
    user.password
  )
  if (!checkPassword) return {
    code: 422,
    message: "wrong password"
  }
}
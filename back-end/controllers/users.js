const UserModel = require('../model/users');
const APIAuthModel = require('../model/apiauth');
const Jwt = require("./sessionauth");
const {v4} = require("uuid");
const ErrorEnum = require('../errors')



exports.insert = async function (username, password, email) {
  const user = await UserModel.findOne({username: username});
  if (user) return ErrorEnum.Exist('User');
  
  const mail = await UserModel.findOne({email: email});
  if (mail) return ErrorEnum.Exist('Email');
  
  
  try {
    await new UserModel({
      username: username,
      password: password,
      email: email
    }).save().then(async () => {
      await new APIAuthModel({
        username: username
      }).save();
      }
    );
    return ErrorEnum.OK;
  } catch (e) {
    console.log(e);
    return ErrorEnum.NotCreated('User');
  }
  
}

exports.createToken = async function (username, description, token = v4()) {
  try {
    await new APIAuthModel({
      token: token,
      username: username,
      description: description
    }).save();
    return ErrorEnum.OK;
  } catch (e) {
    console.log(e);
    return ErrorEnum.NotCreated('Token');
  }
}

// querying
exports.list = async function (page = 1, limit = 10) {
  let skip = (page - 1) * limit
  return UserModel.find().skip(skip).limit(limit);
}

exports.find = async function (username) {
  let user = await UserModel.findOne({username: username});
  let tokens = await APIAuthModel.find({username: username});
  
  return {...ErrorEnum.OK, user: user, tokens: tokens};
}




exports.findUsername = async function (token) {
  try {
    let username = await APIAuthModel.findOne({token: token});
    return username.username;
  } catch (e) {
    return ErrorEnum.NotFound('User');
  }
}

// update
exports.updatePassword = async function (username, oldpwd, newpwd) {
  const res = await this.login(username, oldpwd);
  if (res.code !== 200) return ErrorEnum.WrongPassword;
  UserModel.findOne({username: username}, function (err, user) {
    if (err) return ErrorEnum.NotFound('User');
  
    user.set({password: newpwd});
    user.save();
  })
  return ErrorEnum.OK;
  
}

// deleting
exports.deleteToken = function (token) {
  APIAuthModel.deleteOne({token: token}, err => {
    if (err) return ErrorEnum.NotDeleted('Token');
  })
  return ErrorEnum.OK;
}

exports.deleteUser = function (username) {
  APIAuthModel.deleteMany({username: username}, err => {
    if (err) {
      return ErrorEnum.NotDeleted('Token');
    }
  })
  
  UserModel.deleteOne({username: username}, err => {
    if (err) {
      console.log(err);
      return ErrorEnum.NotDeleted('User');
    }
  })
  
  return ErrorEnum.OK;
}


// validation
exports.login = async function (username, password) {
  const user = await UserModel.findOne({username: username});
  if (!user) return ErrorEnum.NotFound('User');
  
  const checkPassword = require('bcryptjs').compareSync(password, user.password)
  if (!checkPassword) return ErrorEnum.WrongPassword;
  
  const jwt = new Jwt(username);
  const token = jwt.generateToken();
  // console.log(token)
  return {...ErrorEnum.OK, token: token};
}
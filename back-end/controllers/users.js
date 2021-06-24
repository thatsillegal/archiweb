const UserModel = require('../model/users');
const APIAuthModel = require('../model/apiauth');



// construct a doc
exports.insert = function (username, password, sid) {
  new UserModel({
    username: username,
    password: password,
    sid: sid
  }).save().then(() => {
      new APIAuthModel({
        username: username
      }).save().then(() => {
        return {code: 200, message: "OK"};
      });
    }
  );
  return {code: 503, message: 'Error'}
}

exports.createToken = function (username, description) {
  new APIAuthModel({
    username: username,
    description: description
  }).save().then(r => {
    console.log(r)
    return {code: 200, message: "OK"};
  });
  return {code: 503, message: "Error"};
}

// querying
exports.list = async function (page = 1, limit = 10) {
  let skip = (page - 1) * limit
  return UserModel.find().skip(skip).limit(limit);
}

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
exports.updatePassword = async function (username, oldpwd, newpwd) {
  const res = await this.login(username, oldpwd);
  if (res.code !== 200) return {
    code: 503,
    message: "wrong password"
  }
  UserModel.findOne({username: username}, function (err, user) {
    if (err) return {
      code: 503,
      message: "error"
    }
    user.set({password: newpwd});
    user.save().then(r => console.log('r' + r));
  })
  
}

// deleting
exports.deleteToken = function (token) {
  APIAuthModel.deleteOne({token: token}, err => {
    if (err) return {
      code: 503,
      message: "deleting error"
    }
  })
  return {
    code: 200,
    message: "OK"
  }
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
  
  return {
    code: 200,
    message: "OK"
  }
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
  return {code: 200, message: "OK"};
}
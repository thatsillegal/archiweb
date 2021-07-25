const UserModel = require('../model/users');
const APIAuthModel = require('../model/apiauth');
const Jwt = require("./sessionauth");
const {v4} = require("uuid");


// construct a doc
exports.insert = async function (username, password, email) {
  
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
    return {code: 200, message: "OK"};
  } catch (e) {
    console.log(e);
    return {code: 503, message: "Error"};
  }
  
}

exports.createToken = async function (username, description, token = v4()) {
  try {
    await new APIAuthModel({
      token: token,
      username: username,
      description: description
    }).save();
    return {code: 200, message: "OK"};
  } catch (e) {
    console.log(e);
    return {code: 503, message: "Error"};
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
  // console.log(user);
  // console.log(tokens);
  
  return {user: user, tokens: tokens};
}

exports.existUser = async function (username) {
  const user = await UserModel.findOne({username: username});
  
  if (!user) {
    return {
      code: 422,
      message: "user not found"
    }
  }
  return {
    code: 421,
    message: "user exist"
  }
}

exports.existEmail = async function (email) {
  const mail = await UserModel.findOne({email: email});
  if (!mail) {
    return {
      code: 432,
      message: "email not found"
    }
  } else {
    return {
      code: 431,
      message: "email exist"
    }
  }
}


exports.findUsername = async function (token) {
  try {
    let username = await APIAuthModel.findOne({token: token});
    return username.username;
  } catch (e) {
    return {code: 503, message: "Error"}
  }
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
  return {code: 200, message: "OK"};
  
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
  
  const jwt = new Jwt(username);
  const token = jwt.generateToken();
  console.log(token)
  return {code: 200, message: "OK", token: token};
}
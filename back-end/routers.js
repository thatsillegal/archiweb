const Router = require("koa-router");
const cors = require('koa2-cors');

const ErrorEnum = require("./errors");

const Jwt = require("./controllers/sessionauth");
const userController = require('./controllers/users');
const connController = require('./controllers/connections');

let api = new Router();

api.cros = cors({
  origin: function (ctx) {
    return '*';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Token'],
});


let passURL = ['/api/user/delete', '/api/user/find', '/api/token/create', '/api/token/delete', '/api/user/update'];
api.checkToken = async function (ctx, next) {
  if (passURL.includes(ctx.request.url)) {
    ctx.set("Access-Control-Allow-Origin", "*");
    const token = ctx.header.token
    const user = await ctx.request.body
    
    if ((token === undefined && Object.keys(user).length !== 0)) {
      ctx.response.body = ErrorEnum.WrongToken;
      return;
    }
    
    if (token) {
      const jwt = new Jwt(user.username);
      const res = await jwt.verifyToken(token);
      if (!res) {
        ctx.response.body = ErrorEnum.WrongToken;
        return;
      }
    }
  }
  await next();
};


api.post('/user/insert', async (ctx) => {
  let user = await ctx.request.body;
  ctx.response.body = await userController.insert(user.username, user.password, user.email);
})

api.post('/user/delete', async (ctx) => {
  let user = await ctx.request.body;
  ctx.response.body = await userController.deleteUser(user.username);
});

api.post('/user/find', async (ctx) => {
  let user = await ctx.request.body;
  ctx.response.body = await userController.find(user.username);
})

api.post('/user/update', async (ctx) => {
  let user = await ctx.request.body;
  ctx.response.body = await userController.updatePassword(user.username, user.oldpwd, user.newpwd);
})

api.post('/token/create', async (ctx) => {
  let token = await ctx.request.body;
  ctx.response.body = await userController.createToken(token.username, token.description)
})

api.post('/token/delete', async (ctx) => {
  let token = await ctx.request.body;
  ctx.response.body = await userController.deleteToken(token.token);
})

api.post('/user/login', async (ctx) => {
  let user = await ctx.request.body;
  ctx.response.body = await userController.login(user.username, user.password);
})


api.get('/connection/token', async (ctx) => {
  let args = await ctx.query;
  
  if (args.count) {
    ctx.response.body = {count: await connController.count(args.token, !!args.alive)};
  } else {
    ctx.response.body = args.alive ? await connController.queryAlive(args.token) : await connController.queryAll(args.token);
  }
})

api.get('/connection/user', async (ctx) => {
  let args = ctx.query;
  let conns = args.alive ? await connController.findAlive(args.username) : await connController.findAll(args.username)
  ctx.response.body = args.count ? conns.length : conns;
})

module.exports = api;
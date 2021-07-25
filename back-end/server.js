const Koa = require('koa');
const Router = require('koa-router')
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');    //将函数promise化
const stat = promisify(fs.stat);    //用来获取文件的信息
const mime = require('mime');   //mime类型获取插件
const app = new Koa();
const date = new Date();

let server;
const args = process.argv.splice(2);
if (args.length > 0 && args[0] === 'https') {
  const options = {
    key: fs.readFileSync("/home/cert/6010330_web.archialgo.com.key", "utf8"),
    cert: fs.readFileSync("/home/cert/6010330_web.archialgo.com.pem", "utf8")
  };
  server = require('https').createServer(options, app.callback());
  console.info(date.toLocaleString(), "Set up https");
} else {
  server = require('http').createServer(app.callback());
  console.info(date.toLocaleString(), "Set up http")
}


function static_files(dir) {
  return async (ctx, next) => {
    let pathname = ctx.path;
    let realPath = path.join(dir, pathname);
    
    try {
      let statObj = await stat(realPath);
      if (statObj.isFile()) {
        ctx.set('Content-Type', mime.getType(realPath) + ";charset=utf-8");
        ctx.body = fs.createReadStream(realPath)
      } else {
        //如果不是文件，则判断是否存在index.html
        let filename = path.join(realPath, 'index.html')
        await stat(filename)
        ctx.set('Content-Type', "text/html;charset=utf-8");
        ctx.body = fs.createReadStream(filename);
      }
    } catch (e) {
      await next();   //交给后面的中间件处理
    }
  }
}


const userController = require('./controllers/users');
const connController = require('./controllers/connections');

app.use(static_files(__dirname));
app.use(bodyParser())


let api = new Router();

let passURL = ['/api/user/delete', '/api/user/find', '/api/token/create', '/api/token/delete'];
app.use(async (ctx, next) => {
  if (passURL.includes(ctx.request.url)) {
    ctx.set("Access-Control-Allow-Origin", "*");
    // console.log(ctx.request.url)
    const token = ctx.header.token
    // console.log('token: ' + token);
    const user = await ctx.request.body
    // console.log(user)
    
    if ((token === undefined && Object.keys(user).length !== 0)) {
      // console.log(user)
      ctx.response.body = {code: 503, message: "Error"}
      return;
    }
    
    if (token) {
      const jwt = new Jwt(user.username);
      const res = await jwt.verifyToken(token);
      // console.log(res);
      if (!res) {
        ctx.response.body = {code: 503, message: "Error"}
        return;
      }
    }
    
  }
  await next();
});

api.post('/user/insert', async (ctx) => {
  let user = await ctx.request.body;
  
  const existUser = await userController.existUser(user.username);
  const existMail = await userController.existEmail(user.email);
  
  ctx.set("Access-Control-Allow-Origin", "*");
  if (existUser.code === 421) {
    ctx.response.body = existUser;
  } else if (existMail.code === 431) {
    ctx.response.body = existMail;
  } else {
    // /** delete for test **/
    // userController.deleteUser(user.username);
    ctx.response.body = await userController.insert(user.username, user.password, user.email);
  }
  
})

api.post('/user/delete', async (ctx) => {
  let user = await ctx.request.body;
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.response.body = await userController.deleteUser(user.username);
});

api.post('/user/find', async (ctx) => {
  let user = await ctx.request.body;
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.response.body = await userController.find(user.username);
})

api.post('/token/create', async (ctx) => {
  
  let token = await ctx.request.body;
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.response.body = await userController.createToken(token.username, token.description)
})

api.post('/token/delete', async (ctx) => {
  let token = await ctx.request.body;
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.response.body = await userController.deleteToken(token.token);
})

api.post('/user/login', async (ctx) => {
  let user = await ctx.request.body;
  ctx.set("Access-Control-Allow-Origin", "*");
  console.log(user);
  ctx.response.body = await userController.login(user.username, user.password);
})


api.get('/connection/token', async (ctx) => {
  let args = await ctx.query;
  ctx.set("Access-Control-Allow-Origin", "*");
  
  if (args.count) {
    ctx.response.body = {count: await connController.count(args.token, !!args.alive)};
  } else {
    ctx.response.body = args.alive ? await connController.queryAlive(args.token) : await connController.queryAll(args.token);
  }
  
  
})

api.get('/connection/user', async (ctx) => {
  let args = ctx.query;
  ctx.set("Access-Control-Allow-Origin", "*");
  let conns = args.alive ? await connController.findAlive(args.username) : await connController.findAll(args.username)
  ctx.response.body = args.count ? conns.length : conns;
})

let router = new Router();
// router.use('/', home.routes(), home.allowedMethods());
router.use('/api', api.routes(), api.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());

app.use(cors({
  origin: function (ctx) {
    if (ctx.url === '/test') {
      return "*"; // 允许来自所有域名请求
    }
    return '*'; // 这样就能只允许 http://localhost:8080 这个域名的请求了
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Token'],
}))


// console.log(process.env.MONGO_URL);
const connStr = process.env.MONGO_URL;
const mongoose = require('mongoose')
const Jwt = require("./controllers/sessionauth");
mongoose.connect(connStr, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// on connect
mongoose.connection.once('open', async function () {
  console.log('Mongoose default connection open to ' + connStr);
  await connController.reboot();
  
  /**----------------------- SOCKET IO -------------------------**/
  const io = require('./io');
  io.createSocketIO(server);
})

// on error
mongoose.connection.on('error', function (err) {
  console.error('Mongoose default connection error: ' + err);
});

// on disconnect
mongoose.connection.on('disconnected', function () {
  console.error('Mongoose default connection disconnected');
  
});


server.listen(27781, () => {
  console.log("listening on *:27781")
});

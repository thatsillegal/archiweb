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

const http = require('http').createServer(app.callback());

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
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))
/**----------------------- SOCKET IO -------------------------**/

const io = require('./io');
io.createSocketIO(http);

// console.log(process.env.MONGO_URL);
const connStr = process.env.MONGO_URL;
const mongoose = require('mongoose')
mongoose.connect(connStr, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// on connect
mongoose.connection.once('open', async function () {
  console.log('Mongoose default connection open to ' + connStr);
  await connController.reboot();
  
  let api = new Router();
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
    let conns = args.alive ? await connController.queryAlive(args.token) : await connController.queryAll(args.token)
    ctx.response.body = args.count ? conns.length : conns;
    
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
})

// on error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// on disconnect
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});


http.listen(27781, () => {
  console.log("listening on *:27781")
});

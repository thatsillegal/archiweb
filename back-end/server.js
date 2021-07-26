const Koa = require('koa');
const app = new Koa();


/**
 * create server https/http
 */
const fs = require('fs');
const date = new Date();
let server;
const args = process.argv.splice(2);

let PORT = 27781;
if (args.length > 1) PORT = args[1];

if (args.length > 0 && args[0] === 'https') {
  const options = {
    key: fs.readFileSync("/home/cert/6010330_web.archialgo.com.key", "utf8"),
    cert: fs.readFileSync("/home/cert/6010330_web.archialgo.com.pem", "utf8")
  };
  server = require('https').createServer(options, app.callback());
  console.info(date.toLocaleString(), "Set up https, port " + PORT);
} else {
  if (!isNaN(Number.parseInt(args[0]))) PORT = args[0];
  
  server = require('http').createServer(app.callback());
  console.info(date.toLocaleString(), "Set up http, port " + PORT)
}
server.listen(PORT);


/**
 * route static files
 */
const {promisify} = require('util');
const stat = promisify(fs.stat);
const mime = require('mime');
const path = require('path');

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
        let filename = path.join(realPath, 'index.html')
        await stat(filename)
        ctx.set('Content-Type', "text/html;charset=utf-8");
        ctx.body = fs.createReadStream(filename);
      }
    } catch (e) {
      await next();
    }
  }
}

app.use(static_files(__dirname));


/**
 * route apis
 */
const Router = require('koa-router')
const api = require("./routers");
const bodyParser = require('koa-bodyparser');

app.use(bodyParser())
app.use(api.checkToken);
app.use(api.cros)

let router = new Router();
router.use('/api', api.routes(), api.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());


/**
 * database connection
 */
const connStr = process.env.MONGO_URL;
const mongoose = require('mongoose')

mongoose.connect(connStr, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(async r => {
  console.log('CONNECTION STR: ' + connStr);
  console.log('MODEL SCHEMA: ', Object.keys(r['modelSchemas']));
  const connController = require('./controllers/connections');
  await connController.reboot();
  
  /**----------------------- SOCKET IO -------------------------**/
  const io = require('./io');
  io.createSocketIO(server);
});




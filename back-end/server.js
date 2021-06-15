const Koa = require('koa');
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

app.use(static_files(__dirname));

console.log(process.env.MONGO_URL);
const io = require('./io');
io.createSocketIO(http);

const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => console.log("db connnected"));
mongoose.connection.on('error', console.error)


http.listen(27781, () => {
  console.log("listening on *:27781")
});

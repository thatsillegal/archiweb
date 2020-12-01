const Koa = require('koa');
const Router = require('koa-router');

const fs = require('fs');
const path = require('path');
const {promisify} = require('util');    //将函数promise化

const stat = promisify(fs.stat);    //用来获取文件的信息
const mime = require('mime');   //mime类型获取插件

let app = new Koa();
let router = new Router();


const http = require('http').createServer(app.callback());
const io = require('socket.io')(http);

function static(dir) {
    return async (ctx, next) => {
        let pathname = ctx.path;
        let realPath = path.join(dir, pathname);

        console.log("real path " + realPath);
        try {
            let statObj = await stat(realPath);
            if (statObj.isFile()) {
                console.log("Send File !");
                ctx.set('Content-Type', mime.getType(realPath) + ";charset=utf-8");
                ctx.body = fs.createReadStream(realPath)
            } else {
                //如果不是文件，则判断是否存在index.html
                let filename = path.join(realPath, 'index.html')
                console.log("Send index" + filename);
                await stat(filename)
                ctx.set('Content-Type', "text/html;charset=utf-8");
                ctx.body = fs.createReadStream(filename);
            }
        } catch (e) {
            await next();   //交给后面的中间件处理
        }
    }
}

app.use(static(__dirname));
app.use(router.routes());


io.on('connection', socket => {
    console.info(`Client connected [id=${socket.id}]`);
    socket.on('disconnect', async function () {
        console.info(`Client [id=${socket.id}] disconnect :)`);
    });

    socket.on('bts:sendGeometry', async function (data) {
        console.log('bts:sendGeometry: ' + data);
        data.id = socket.id;
        
        test = {
            verts: [
                [ 1055.5488810559277, 223.62985233130985, 0 ],
                [ 950.220444680404, -174.9498006713706, 100 ],
                [ 755.5488810559278, 300, 300 ],
                [ 755.5488810559278, 0, 100 ],
                [ 873.5331585297903, 0, 100 ],
                [ 1055.5488810559277, 300, 300 ],
                [ 1055.5488810559277, 300, 0 ],
                [ 873.5331585297903, -76.37014766869015, 100 ],
                [ 950.220444680404, -76.37014766869015, 100 ],
                [ 650.220444680404, 125.05019932862939, 0 ],
                [ 755.5488810559278, 0, 300 ],
                [ 1173.5331585297904, 223.62985233130985, 150 ],
                [ 1055.5488810559277, 223.62985233130985, 150 ],
                [ 755.5488810559278, 125.05019932862939, 0 ],
                [ 1173.5331585297904, -76.37014766869015, 0 ],
                [ 755.5488810559278, 300, 0 ],
                [ 950.220444680404, -76.37014766869015, 0 ],
                [ 950.220444680404, -174.9498006713706, 0 ],
                [ 650.220444680404, -174.9498006713706, 0 ],
                [ 755.5488810559278, 125.05019932862939, 100 ],
                [ 650.220444680404, 125.05019932862939, 100 ],
                [ 1173.5331585297904, 223.62985233130985, 0 ],
                [ 650.220444680404, -174.9498006713706, 100 ],
                [ 1173.5331585297904, -76.37014766869015, 150 ],
                [ 873.5331585297903, 0, 150 ],
                [ 873.5331585297903, -76.37014766869015, 150 ],
                [ 1055.5488810559277, 0, 150 ],
                [ 1055.5488810559277, 0, 300 ]
            ],
            faces: [
                [ 18, 16, 17 ], [ 20, 9, 18 ],  [ 2, 10, 27 ],
                [ 12, 11, 21 ], [ 19, 10, 2 ],  [ 20, 3, 19 ],
                [ 6, 12, 0 ],   [ 8, 14, 23 ],  [ 9, 20, 19 ],
                [ 22, 18, 17 ], [ 2, 5, 6 ],    [ 25, 26, 24 ],
                [ 14, 21, 11 ], [ 1, 17, 16 ],  [ 27, 24, 26 ],
                [ 24, 4, 7 ],   [ 18, 9, 13 ],  [ 13, 15, 0 ],
                [ 18, 13, 16 ], [ 0, 15, 6 ],   [ 21, 14, 0 ],
                [ 0, 14, 16 ],  [ 0, 16, 13 ],  [ 22, 20, 18 ],
                [ 5, 2, 27 ],   [ 0, 12, 21 ],  [ 3, 10, 19 ],
                [ 2, 15, 19 ],  [ 19, 15, 13 ], [ 22, 1, 7 ],
                [ 7, 1, 8 ],    [ 22, 7, 3 ],   [ 3, 7, 4 ],
                [ 20, 22, 3 ],  [ 5, 27, 12 ],  [ 12, 27, 26 ],
                [ 6, 5, 12 ],   [ 16, 14, 8 ],  [ 23, 25, 8 ],
                [ 8, 25, 7 ],   [ 13, 9, 19 ],  [ 1, 22, 17 ],
                [ 15, 2, 6 ],   [ 23, 11, 26 ], [ 26, 11, 12 ],
                [ 25, 23, 26 ], [ 23, 14, 11 ], [ 8, 1, 16 ],
                [ 10, 3, 24 ],  [ 24, 3, 4 ],   [ 10, 24, 27 ],
                [ 25, 24, 7 ]
            ],
            colors: [ '-1' ],
            col_FaceNum: [ 52 ]
        }
    
        io.emit('stb:receiveGeometry', test);
    
    
        io.emit('bts:receiveGeometry', data);

    });

});

http.listen(27781, () => {
    console.log("listening on *:27781")
});

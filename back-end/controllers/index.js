exports.index = async function (ctx) {
  
  let links = [
    "<a href='/api/user/insert'>新建用户</a>",
    "<a href='/api/user/list'>全部用户</a>",
    "<a href='/api/user/find'>查找用户</a>",
    "<a href='/api/user/delete'>删除用户</a>",
    "<a href='/api/token/delete'>删除token</a>",
    "<a href='/api/token/create'>创建token</a>",
    "<a href='/api/drop'>drop users</a>",
  
    "<a href='/api/connection/list'>所有连接</a>",
    "<a href='/api/connection/token'>token连接</a>",
    "<a href='/api/connection/user'>用户连接</a>",
  ];
  
  ctx.body = links.join("<br />");
};
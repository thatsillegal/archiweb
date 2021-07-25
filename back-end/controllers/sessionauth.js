const fs = require('fs');
const redis = require('redis'),
  session = redis.createClient();

const {promisify} = require("util");
const getAsync = promisify(session.get).bind(session);
const setAsync = promisify(session.set).bind(session);

session.on("error", function (error) {
  console.error(error);
});


const jwt = require('jsonwebtoken');

class Jwt {
  constructor(username) {
    this.username = username;
  }
  
  generateToken() {
    const username = this.username;
    const created = Date.now();
    const cert = fs.readFileSync(process.env.RSA_PRIVATE_KEY);
    const token = jwt.sign(
      {
        username,
        exp: created + 60 * 1000 * 5 * 24 * 60
      },
      cert,
      {algorithm: 'RS256'}
    );
    
    session.set(username, token, (e) => {
      console.log(e)
    });
    //
    // await setAsync(username, token, (e) => {
    //   console.error(e);
    // })
    
    return token;
  }
  
  async verifyToken(userToken) {
    
    const cert = fs.readFileSync(process.env.RSA_PUBLIC_KEY);
    let username;
    try {
      const result = jwt.verify(userToken, cert, {algorithms: ['RS256']}) || {};
      
      const {exp = 0} = result;
      const current = Date.now();
      
      //验证时效性
      if (current <= exp) {
        username = result.username || {};
      } else {
        return false;
      }
      
      //验证用户名
      if (username === this.username) {
        let token = await getAsync(this.username).catch(console.error)
        return token === userToken;
        
      } else {
        return false;
      }
      
    } catch (e) {
      console.error(e)
    }
    return false;
    
  }
}

module.exports = Jwt;

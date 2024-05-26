const { myCache } = require("../utils");

async function onLogin(user) {
  myCache.del("qrcode");
  console.log(`贴心小助理${user}登录了`);
}

module.exports = onLogin;

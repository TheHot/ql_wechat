const { WechatyBuilder } = require("wechaty");

const onScan = require("./listeners/on-scan.js");
const onLogin = require("./listeners/on-login.js");
const onMessage = require("./listeners/on-message.js");
const onFriendship = require("./listeners/on-friendship.js");

const bot = WechatyBuilder.build({
  // name: "wechat-bot",
  puppet: "wechaty-puppet-wechat",
  puppetOptions: {
    uos: true,
  },
});
bot.on("login", async (user) => {
  onLogin(user, bot);
});
bot.on("message", async (msg) => {
  onMessage(msg, bot);
});
bot.on("scan", async (qrcode, status) => {
  onScan(qrcode, status);
});
bot.on("friendship", async (friendship) => {
  onFriendship(friendship);
});
bot
  .start()
  .then(() => console.log("开始登陆微信"))
  .catch((e) => console.error(e));

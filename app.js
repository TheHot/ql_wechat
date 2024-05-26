const { WechatyBuilder } = require("wechaty");
const express = require("express");
const { renderHtmlToImage, myCache } = require("./utils");

const app = express();
const port = 3000;
app.set("views", "public");
app.set("view engine", "ejs");

const onScan = require("./listeners/on-scan.js");
const onLogin = require("./listeners/on-login.js");
const onMessage = require("./listeners/on-message.js");
const onFriendship = require("./listeners/on-friendship.js");

const bot = WechatyBuilder.build({
  // 是否开启登录缓存
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
  .then(async () => {
    app.get("/sendToWx", async (req, res) => {
      try {
        const friend = await bot.Contact.find({ name: req.query?.name });
        friend &&
          friend.say(
            await renderHtmlToImage(
              req.query?.msg
                ?.split("\n")
                .map((item) => `<p>${item}</p>`)
                .join("")
            )
          );
        res.json({ status: "success" });
      } catch (error) {
        res.json({ status: "error", msg: error?.message });
      }
    });
    app.get("/qrcode", async (req, res) => {
      const qrcodeUrl = myCache.get("qrcode");
      res.render("qrcode", { qrcode: qrcodeUrl });
    });
    app.listen(port, () => {
      console.log(`WxMessage listening on port ${port}`);
    });
  })
  .then(() => console.log("开始登陆微信"))
  .catch((e) => console.error(e));

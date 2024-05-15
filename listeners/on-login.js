const express = require("express");
const app = express();
const port = 3000;
const { renderHtmlToImage } = require("../utils");

async function onLogin(user, bot) {
  console.log(`贴心小助理${user}登录了`);
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
  app.listen(port, () => {
    console.log(`WxMessage listening on port ${port}`);
  });
}

module.exports = onLogin;

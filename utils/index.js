const nodeHtmlToImage = require("node-html-to-image");
const { FileBox } = require("file-box");
const NodeCache = require("node-cache");
const myCache = new NodeCache();

function wait(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function renderHtmlToImage(html) {
  const imageBuffer = await nodeHtmlToImage({
    html: `<html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          padding: 20px;
          width: 650px;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol, "Noto Color Emoji";
        }
      </style>
    </head>
    <body>${html}</body>
  </html>`,
    puppeteerArgs: {
      args: ["--no-sandbox", "--disable-dev-shm-usage", "--lang=zh-CN"],
    },
  });
  return FileBox.fromBuffer(imageBuffer, "message_image.png");
}

function loadScript(scriptPath) {
  delete require.cache[scriptPath];
  return require(scriptPath);
}

module.exports = {
  wait,
  renderHtmlToImage,
  loadScript,
  myCache,
};

const { myCache } = require("../utils");

/**
 * 获取二维码，登录
 */
async function onScan(qrcode, status) {
  require("qrcode-terminal").generate(qrcode, { small: true });

  const qrcodeImageUrl = [
    "https://api.qrserver.com/v1/create-qr-code/?data=",
    encodeURIComponent(qrcode),
  ].join("");

  myCache.set("qrcode", qrcodeImageUrl);

  console.log(status, qrcodeImageUrl);
}

module.exports = onScan;

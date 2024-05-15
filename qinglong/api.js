const superagent = require("superagent");
const QLSDK = require("./sdk");

// 青龙地址
const BASE_URL = "";
// 青龙应用ID
const ClientID = "";
// 青龙应用密钥
const ClientSecret = "";

async function ql() {
  const res = await superagent("GET", `${BASE_URL}/open/auth/token`).query({
    client_id: ClientID,
    client_secret: ClientSecret,
  });
  const data = res?.body?.data;
  return new QLSDK(BASE_URL, `${data.token_type} ${data.token}`);
}

module.exports = ql;

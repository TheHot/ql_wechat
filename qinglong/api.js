const path = require("path");
const superagent = require("superagent");
const QLSDK = require("./sdk");
const { loadScript } = require("../utils");

async function ql() {
  const { BASE_URL, ClientID, ClientSecret } = loadScript(
    path.resolve(__dirname, "../config/index.js")
  );
  const res = await superagent("GET", `${BASE_URL}/open/auth/token`).query({
    client_id: ClientID,
    client_secret: ClientSecret,
  });
  const data = res?.body?.data;
  return new QLSDK(BASE_URL, `${data.token_type} ${data.token}`);
}

module.exports = ql;

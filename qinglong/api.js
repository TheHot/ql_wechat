const superagent = require("superagent");
const QLSDK = require("./sdk");
const { BASE_URL, ClientID, ClientSecret } = require("../config");

async function ql() {
  const res = await superagent("GET", `${BASE_URL}/open/auth/token`).query({
    client_id: ClientID,
    client_secret: ClientSecret,
  });
  const data = res?.body?.data;
  return new QLSDK(BASE_URL, `${data.token_type} ${data.token}`);
}

module.exports = ql;

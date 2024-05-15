const superagent = require("superagent");

class QLSDK {
  constructor(baseUrl, token) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  req(api, method, data) {
    return new Promise((resolve, reject) => {
      superagent(method, this.baseUrl + api)
        .set("Content-Type", "application/json")
        .set(
          "User-Agent",
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36 Edg/94.0.992.38"
        )
        .set("Authorization", `${this.token}`)
        .send(data)
        .end(function (err, response) {
          if (err) {
            reject(err);
          }
          resolve(response.body);
        });
    });
  }

  getEnv() {
    return this.req("/open/envs", "GET");
  }

  addEnv(data) {
    return this.req("/open/envs", "POST", data);
  }

  delEnv(data) {
    return this.req("/open/envs", "DELETE", data);
  }
}

module.exports = QLSDK;

const path = require("path");
const ql = require("../qinglong/api");
const { loadScript } = require("../utils");
const { renderHtmlToImage } = require("../utils");
const shelljs = require("shelljs");

class Task {
  constructor(msg, bot) {
    const config = loadScript(path.resolve(__dirname, "../config/index.js"));
    const {
      command: { menuList },
    } = config;
    this.menuList = menuList;
    this.status = "pending";
    this.msg = msg;
    this.bot = bot;
    this.contact = msg.talker();
    this.taskStack = [];
    this.currentTask = this.menu;
    this.ql = null;
    this.envList = [];
    this.run(msg);
  }

  async run(msg) {
    this.msg = msg;
    this.content = this.msg.text().trim();
    await this.currentTask();
    return this.status;
  }

  async menu() {
    const _menu = this.menuList.find((m) =>
      new RegExp(`^${m.cmd}$`).test(this.content)
    );
    if (!_menu) return;
    const { mode, ql_script, callback, white_list, handler } = _menu;
    if (white_list && white_list.length) {
      if (!white_list.includes(this.contact.name())) return;
    }
    if (mode === "ql_script") {
      const { prefix, suffix, scripts } = ql_script;
      this.msg.say(
        `${prefix ? `${prefix}` : ""}\r\n${scripts
          .map((v, i) => `${i}. ${v.desc}`)
          .join("\r\n")}${suffix ? `${suffix}` : ""}`
      );
      this.scripts = scripts;
      this.currentTask = this.taskList;
    } else if (mode === "customize") {
      handler.call(this);
      this.currentTask = callback;
    }
  }

  async taskList() {
    const regx = new RegExp(
      `^[${Array.from({ length: this.scripts.length }, (_, i) => i).join("")}]$`
    );
    if (regx.test(this.content)) {
      const script = this.scripts[this.content];
      const { envName, mode, black_list, white_list } = script;
      if (mode === "black") {
        if (black_list.includes(this.contact.name())) {
          this.msg.say("暂无脚本权限，请联系管理员");
          return;
        }
      } else {
        if (!white_list.includes(this.contact.name())) {
          this.msg.say("暂无脚本权限，请联系管理员");
          return;
        }
      }
      this.script = script;
      this.envName = envName;
      const envList = await this._getQlEnvList();
      const envListFilter = envList.filter((item) => {
        if (!item.remarks || !this.contact.name()) {
          return false;
        } else if (
          item.remarks === this.contact.name() &&
          item.name === envName
        ) {
          return true;
        }
      });
      if (envListFilter.length) {
        this.msg.say(
          `账号列表\r\n----------------------------\r\n${envListFilter
            .map((item, index) => {
              const maskValue = `${item.value?.slice(
                0,
                3
              )}****${item.value?.slice(-4)}`;
              return `${index}. ${maskValue}${
                item.status === 1 ? "（已禁用）" : ""
              }`;
            })
            .join(
              "\r\n"
            )}\r\n\r\n操作指令\r\n----------------------------\r\n添加：add\r\n删除：del\r\n执行：账号序号（例：0）`
        );
        this.envList = envListFilter;
        this.currentTask = this.operaterEnv;
      } else {
        this.msg.say("暂无账号绑定\r\n回复：手机号#服务密码\r\n回 q 退出");
        this.currentTask = this.bindEnv;
      }
    }
  }

  async bindEnv() {
    let { limit_total, limit_person, regx } = this.script;
    if (!regx) regx = /.*/;
    const totalEnv = await this._getQlEnvList();
    const currEnvNum = totalEnv.filter((i) => i.name === this.envName);
    if (this.envList.length >= limit_person) {
      this.msg.say("账号已达上限，不要贪心哦");
      return;
    }
    if (currEnvNum.length >= limit_total) {
      this.msg.say("资源池已满，请联系管理员");
      return;
    }
    if (regx.test(this.content)) {
      try {
        await this.ql.addEnv([
          {
            name: this.envName,
            value: this.content,
            remarks: this.contact.name(),
          },
        ]);
        this.msg.say("绑定成功，请继续，回 q 退出");
      } catch (error) {
        console.log(error);
        this.msg.say("操作失败，请联系管理员，或重新尝试，回 q 退出");
      }
    } else {
      this.msg.say("格式有误，请重新输入，回 q 退出");
    }
  }

  async delEnv() {
    const regx = new RegExp(
      `^[${Array.from({ length: this.envList.length }, (_, i) => i).join("")}]$`
    );
    if (regx.test(this.content)) {
      try {
        await this.ql.delEnv([this.envList[parseInt(this.content)].id]);
        this.msg.say("操作成功，请继续，回 q 退出");
      } catch (error) {
        console.log(error);
        this.msg.say("操作失败，请联系管理员，或重新尝试");
      }
    }
  }

  async operaterEnv() {
    const { envExample } = this.script;
    const regx = new RegExp(
      `^[${Array.from({ length: this.envList.length }, (_, i) => i).join("")}]$`
    );
    const regx2 = /^add$/;
    const regx3 = /^del$/;
    if (regx.test(this.content)) {
      try {
        await this.runScript();
      } catch (error) {
        console.log(error);
        this.msg.say("操作失败，请重新操作！");
        this.status = "done";
      }
    } else if (regx2.test(this.content)) {
      this.msg.say(`示例：${envExample}`);
      this.currentTask = this.bindEnv;
    } else if (regx3.test(this.content)) {
      this.msg.say("回复序号进行删除，回 q 退出");
      this.currentTask = this.delEnv;
    } else {
      this.errorHandler();
    }
  }

  async runScript() {
    const { script } = this.script;
    if (!script) {
      this.msg.say("啊哦，暂未开放此脚本！");
      return;
    }
    const scriptPath = path.resolve(__dirname, `../script/${script}`);
    this.msg.say("脚本可能耗时较长，请等待！");
    const cmd = `${this.envName}=${
      this.envList[parseInt(this.content)].value
    } node ${scriptPath}`;
    const log = shelljs.exec(cmd).toString();
    const logHtml = log
      ?.split("\n")
      .map((item) => `<p>${item}</p>`)
      .join("");
    logHtml && (await this.msg.say(await renderHtmlToImage(logHtml)));
    this.msg.say("执行成功，请继续，回 q 退出");
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  errorHandler() {
    this.msg.say("指令有误，回 q 退出");
  }

  async _getQlEnvList() {
    try {
      if (!this.ql) this.ql = await ql();
    } catch (error) {
      this.msg.say("查询失败，请联系管理员");
      this.status = "done";
      return;
    }
    const qlEnv = (await this.ql.getEnv()) || [];
    return qlEnv?.data || [];
  }
}

module.exports = Task;

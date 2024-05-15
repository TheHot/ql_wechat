const ql = require("../qinglong/api");
const { wait } = require("../utils");

module.exports = {
  IGNORE: [],
  command: {
    menuList: [
      // 青龙变量管理
      {
        // 指令
        cmd: "菜单",
        /**
         * 指令模式
         * 
         * ql_script - 青龙变量管理
         * customize - 自定义：通过自定义hook来自定义指令动作
         */
        mode: "ql_script",
        ql_script: {
          prefix: "指令如下\r\n----------------------------",
          suffix: "\r\n\r\n回复序号进入功能，回 q 退出",
          scripts: [
            {
              // 指令描述
              desc: "电信签到",
              // 青龙变量
              envName: "chinaTelecom",
              // 变量规则校验
              regx: /^\d{11}#\d{6}$/,
              // 变量示例
              envExample: '手机号#服务密码',
              // 用户可执行脚本，/script/tele.all.js
              script: "tele.all.js",
              // 变量可添加上限
              limit_total: 30,
              // 单用户可添加上限
              limit_person: 5,
              // 黑名单列表
              black_list: [],
              // 白名单列表
              white_list: [],
              // 默认黑名单模式：black/white
              mode: "black",
            },
          ],
        },
      },
      // 自定义指令示例，向所有青龙变量备注微信昵称的用户发送公告
      {
        cmd: "/send",
        mode: "customize",
        white_list: ["TheHot"],
        // 处理指令回调
        async handler() {
          this.msg.say('请回复公告内容，回 q 退出')
        },
        // 接收用户值做回调处理
        async callback() {
          const msg = this.content.replace("/send", "").trim();
          try {
            if (!this.ql) this.ql = await ql();
          } catch (error) {
            this.msg.say("环境变量查询失败");
            this.status = "done";
            return;
          }
          const qlEnv = (await this.ql.getEnv()) || [];
          const qlEnvData = qlEnv?.data
            ?.filter(
              (item) => item.remarks !== null && item.remarks.length !== 0
            )
            .map((item) => item.remarks);
          const friendAll = Array.from(new Set(qlEnvData));
          for (let i = 0; i < friendAll.length; i++) {
            const name = friendAll[i];
            try {
              const friend = await this.bot.Contact.find({ name });
              friend && friend.say(msg);
            } catch (error) {
              console.log(error?.message);
              this.msg.say(`好友[${name}]消息发送失败`);
            }
            await wait(1500);
          }
          this.status = "done";
        },
      },
    ],
  },
};

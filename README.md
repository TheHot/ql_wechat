## 青龙变量微信机器人

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-green.svg)](https://github.com/chatie/wechaty) [![Wechaty开源激励计划](https://img.shields.io/badge/Wechaty-开源激励计划-green.svg)](https://github.com/juzibot/Welcome/wiki/Everything-about-Wechaty)

### 注意事项 ！

- node 版本需要 >= 16  
- 由于 windows 自带终端不支持部分`bash命令`，因此 windows 用户不要使用自带终端：`cmd` 或者 `powershell`。这里推荐 `Git bash` 或者第三方命令行工具 `cmder`
- 部分依赖安装不上的问题，建议使用国内源或 `cnpm` 安装依赖  

### 克隆代码

```bash
git clone https://github.com/TheHot/ql_wechat.git
```

### 面板及指令配置

```javascript
// config/index.js
const ql = require("../qinglong/api");
const { wait } = require("../utils");

module.exports = {
  // 青龙面板应用配置
  BASE_URL: '',
  ClientID: '',
  ClientSecret: '',
  // 忽略用户消息
  IGNORE: [],
  command: {
    menuList: [
      // 青龙变量管理
      {
        // 指令
        cmd: "菜单",
        /**
         * 指令模式/自定义模式
         * 
         * ql_script - 青龙变量管理
         * customize - 通过自定义hook来自定义机器人指令动作
         */
        mode: "ql_script",
        ql_script: {
          prefix: "指令如下\r\n----------------------------",
          suffix: "\r\n\r\n回复序号进入功能，回 q 退出",
          scripts: [
            // 电信脚本示例
            {
              // 指令描述
              desc: "电信签到",
              // 青龙变量
              envName: "chinaTelecom",
              // 变量规则校验
              regx: /^\d{11}#\d{6}$/,
              // 自定义校验函数，返回值为校验失败的提示信息，无返回值则校验成功
              verify: async function (context) {
                // context.content -- 用户回复内容
                return yzf_verify(context.content, "电信PLUS会员");
              },
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
    ],
  },
};
```

### 微信通知接口

```javascript
// 端口默认3000，docker安装方式端口请修改为映射到宿主机的端口
http://ip:3000/sendToWx?name=微信昵称&msg=通知内容
```

### 部署

#### Dockerfile（推荐）

```cmd
# 项目根目录执行
docker build -t ql_wechat .

# 启动构建好的镜像
docker run -dit \ 
  -v $HOME/ql_wechat_data/config:/ql_wechat/config \
  -v $HOME/ql_wechat_data/script:/ql_wechat/script \
  -p 9527:3000 \
  --name ql_wechat ql_wechat

# 打开地址扫码登录
http://ip:9527/qrcode

# 配置文件已映射到宿主机HOME目录，支持热更新
$HOME/ql_wechat_config/index.js
```

#### 手动部署

##### 安装依赖

依赖中需要安装`chromium`，使用 npm 会下载失败或者很慢，国内嘛你懂得

```bash
# 推荐使用 pnpm https://pnpm.io/zh/installation
npm install -g cnpm --registry=https://registry.npmmirror.com

# 切到项目根目录
cnpm install

# 启动项目
node app.js
```

##### 后台运行

```shell
# 推荐使用 pm2 来管理
cnpm install -g pm2
pm2 start app.js && pm2 log app
# 日志打印二维码，微信扫码登录
```

### TG交流群

https://t.me/+1Mg7Jm9I8SFjZTk1

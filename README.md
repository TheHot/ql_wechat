### 青龙变量管理微信机器人

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-green.svg)](https://github.com/chatie/wechaty) [![Wechaty开源激励计划](https://img.shields.io/badge/Wechaty-开源激励计划-green.svg)](https://github.com/juzibot/Welcome/wiki/Everything-about-Wechaty)

### 注意事项 ！！！

- node 版本需要 >= 16  
- 由于 windows 自带终端不支持部分`bash命令`，因此 windows 用户不要使用自带终端：`cmd` 或者 `powershell`。这里推荐 `Git bash` 或者第三方命令行工具 `cmder` ，都是不错的选择  
- 部分依赖安装不上的问题，建议使用国内源或 `cnpm` 安装依赖  

### 克隆代码

```bash
git clone https://github.com/TheHot/ql_wechat.git
```

### 目录结构

- `config`配置指令操作
- `qinglong/api`青龙应用配置
- `script`可执行脚本文件

### 安装依赖

依赖中需要安装`chromium`，使用 npm 会下载失败或者很慢，国内嘛你懂得

```bash
# 推荐使用 pnpm https://pnpm.io/zh/installation
npm install -g pnpm@8.3.1
pnpm install
```

可以将 npm 源切换成淘宝源

```bash
npm config set registry https://registry.npm.taobao.org
npm config set disturl https://npm.taobao.org/dist
npm config set puppeteer_download_host https://npm.taobao.org/mirrors
```

### 修改`config`配置

打开`config/index.js` 文件，根据注释来配置自己的指令

### 填写青龙应用ID和密钥

```javascript
// /qinglong/api.js

// 青龙地址
const BASE_URL = "";
// 青龙应用ID
const ClientID = "";
// 青龙应用密钥
const ClientSecret = "";
```

### 运行测试

```bash
# 本地热更新开发
npm run start
# 日志打印二维码，微信扫码登录
```

### 正式环境执行

```shell
# 推荐使用 pm2 来管理
pnpm add -g pm2
pm2 start app.js && pm2 log app
# 日志打印二维码，微信扫码登录
```


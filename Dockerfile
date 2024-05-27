FROM node:16

WORKDIR /ql_wechat

COPY . ./

RUN sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list

RUN apt-get update && apt-get install -y \
  libnss3 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libgbm1 \
  libasound2 \
  libpangocairo-1.0-0 \
  libxss1 \
  libgtk-3-0 \
  vim \
  && npm install -g cnpm --registry=https://registry.npmmirror.com && cnpm install && cnpm install -g pm2

CMD pm2 start app.js && pm2 log app
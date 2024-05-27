const fs = require("fs");
const path = require("path");

const configPath = path.resolve(__dirname, "../config");

function main() {
  if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath);
  }

  try {
    fs.accessSync(path.resolve(configPath, "index.js"));
  } catch (error) {
    fs.copyFileSync(
      path.resolve(__dirname, "../sample/config.sample.js"),
      path.resolve(configPath, "index.js")
    );
  }
}

module.exports = main;

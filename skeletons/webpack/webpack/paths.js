const { resolve } = require("path");
const { cwd } = require("process");

const self = __dirname;
const user = cwd();

// Paths relative to the tool
const config = resolve(self, "./webpack.config.ts");

// Paths relative to the user
const source = resolve(user, "./src");
const output = resolve(user, "./out");
const publicDir = resolve(user, "./public");

// Paths relative to the source directory
const entry = resolve(source, "./main.ts");

module.exports = {
  self,
  user,
  config,
  source,
  output,
  publicDir,
  entry
};

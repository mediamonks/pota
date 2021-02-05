import * as fs from "fs";
import * as path from "path";

const IS_PROD = (process.env.WEBPACK_MODE || process.env.NODE_ENV) === "production";

const USE_VERSIONING = process.env.USE_VERSIONING === "true";
const CUSTOM_VERSION = process.env.CUSTOM_VERSION;

const appDirectory = fs.realpathSync(process.cwd());

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const ENV_FILES = [`.env.${process.env.NODE_ENV}.local`, `.env.local`, `.env`].map((file) =>
  path.resolve(appDirectory, file)
);

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
for (const file of ENV_FILES) {
  if (fs.existsSync(file)) {
    require("dotenv-expand")(require("dotenv").config({ path: file }));
  }
}
// Grab NODE_ENV and PORTER_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in webpack configuration.
const PORTER_APP = /^PORTER_APP_/i;

export default function () {
  const raw = Object.keys(process.env)
    .filter((key) => PORTER_APP.test(key))
    .reduce(
      (env, key) => {
        // @ts-ignore
        env[key] = process.env[key];
        return env;
      },
      {
        PUBLIC_URL: (process.env.PUBLIC_URL || "/")!.slice(0, -1),
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches React into the correct mode.
        NODE_ENV: process.env.NODE_ENV || "development",
        VERSION_PATH:
          USE_VERSIONING && IS_PROD ? `/static/version/${CUSTOM_VERSION || Date.now()}` : "/",
      }
    );
  // Stringify all values so we can feed into webpack DefinePlugin
  const stringified = {
    "process.env": Object.keys(raw).reduce((env, key) => {
      // @ts-ignore
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
}

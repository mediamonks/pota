import { resolve } from "path";
import { existsSync } from "fs";
import * as paths from "./paths.js";

let DEV_SOURCE_MAP = process.env.DEV_SOURCE_MAP || "eval-source-map";
if (DEV_SOURCE_MAP === "false") DEV_SOURCE_MAP = false;
let PROD_SOURCE_MAP = process.env.PROD_SOURCE_MAP || "source-map";
if (PROD_SOURCE_MAP === "false") PROD_SOURCE_MAP = false;

const USE_TYPE_CHECK = process.env.TYPE_CHECK !== "false";

const IS_DEV = process.env.NODE_ENV === "development";
const IS_PROD = (process.env.NODE_ENV === "production") || !IS_DEV;

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const ENV_FILES = [`.env.${process.env.NODE_ENV}.local`, `.env.local`, `.env`].map((file) =>
  resolve(paths.user, file)
);


// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
for (const file of ENV_FILES) {
  if (existsSync(file)) {
    const [{ default: dotEnvExpand }, { default: dotenv }] = await Promise.all([import("dotenv-expand"), import("dotenv")]);

    dotEnvExpand(dotenv.config({ path: file }));
  }
}
// Grab NODE_ENV and PORTER_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in webpack configuration.
const POTA_APP = /^POTA_APP/i;

export function getEnv() {
  const raw = Object.keys(process.env)
    .filter((key) => POTA_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      { PUBLIC_URL: process.env.PUBLIC_URL || "/" }
    );
  // Stringify all values so we can feed into webpack DefinePlugin
  const stringified = {
    "process.env": Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
}

export { DEV_SOURCE_MAP, PROD_SOURCE_MAP, USE_TYPE_CHECK, IS_DEV, IS_PROD };
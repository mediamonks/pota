#!/usr/bin/env node
const semverSatisfies = require("semver/functions/satisfies");

const nodeVersion = process.version;

if (!semverSatisfies(nodeVersion, ">=16")) {
  const { red, green } = require("kleur");
  console.error(
    `
You are running ${red(`node ${nodeVersion}`)}
@pota/create requires ${green("node 16 or higher")}.
Please update your version of node.`
  );
  process.exit(1);
}

const npmVersion = require("child_process").execSync("npm -v", { encoding: "utf8" });

if (!semverSatisfies(npmVersion, ">=7")) {
  const { red, green } = require("kleur");
  console.error(
    `
You are running ${red(`npm ${npmVersion}`)}
@pota/create requires ${green("npm 7 or higher")}.
Please update your version of npm.`
  );
  process.exit(1);
}

import("../lib/index.js");

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

import("../lib/main.js");

import { writeFileSync } from "fs";
import { join } from "path";
import packageJson from "../muban/package.json" assert { type: "json" };

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// create __dirname in esm
const __dirname = new URL(".", import.meta.url).pathname;

yargs(hideBin(process.argv))
  .usage("Usage: $0 [options]")
  .command(
    ["$0"],
    "Start a twig render server",
    () => {},
    (argv) => {
      updateTemplate({
        ...argv,
      });
    }
  )
  .example("$0 -d", "Update template to do local dev.")
  .example("$0 -d -l", "Use local versions of pota dependencies.")
  .example("$0 -r", "Revert changes back to the original template.")
  .option("d", {
    alias: "dev",
    default: undefined,
    describe: "Install dependencies for testing development changes.",
    type: "boolean",
  })
  .option("l", {
    alias: "local",
    default: undefined,
    describe: "Use local version of dependencies.",
    type: "boolean",
  })
  .option("r", {
    alias: "revert",
    default: undefined,
    describe: "Revert all dev changes so they can be committed or published.",
    type: "boolean",
  })
  .conflicts("d", "r")
  .help()
  .version(false)
  .wrap(Math.min(120, yargs(hideBin(process.argv)).terminalWidth()))
  .parse();

function updateTemplate({ dev, revert, local }) {
  if (!dev && !revert) {
    throw new Error("You must specify either -d or -r");
  }

  if (dev) {
    console.log("Updating template for development...");
    console.log("Using local dependencies: ", local);

    packageJson.pota = [
      "../../scripts/muban-webpack/lib/index.js",
      "../../scripts/plop/lib/index.js",
      "pota.config.js",
    ];

    packageJson.devDependencies["@pota/cli"] = local
      ? "../../core/cli"
      : "^2.0.1";
    packageJson.devDependencies["@pota/plop-scripts"] = local
      ? "../../scripts/plop"
      : "^1.0.2";

    packageJson.devDependencies["@pota/muban-webpack-scripts"] = local
      ? "../../scripts/muban-webpack"
      : "^1.2.1";
  }

  if (revert) {
    console.log("Reverting template to original state...");

    delete packageJson.pota;
    delete packageJson.devDependencies["@pota/cli"];
    delete packageJson.devDependencies["@pota/plop-scripts"];

    packageJson.devDependencies["@pota/muban-webpack-scripts"] = "^1.2.1";

    packageJson.config["twig-support"] = false;
  }

  console.log("Writing package.json...");

  writeFileSync(
    join(__dirname, "../muban/package.json"),
    JSON.stringify(packageJson, null, 2),
    "utf8"
  );

  console.log("Done!");
}

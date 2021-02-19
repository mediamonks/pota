require("./register");
import yargs from "yargs/yargs";
import * as fs from "fs";
import * as path from "path";

const cli = yargs(process.argv.slice(2)).command(
  "create [skeleton-type] [app]",
  "create a new porter project",
  {},
  (argv) => require("./create").create(argv.skeletonType, argv.app)
);

const localPackagePath = path.resolve(fs.realpathSync(process.cwd()), "package.json");

if (fs.existsSync(localPackagePath)) {
  const { dependencies = {}, devDependencies = {} } = require(localPackagePath);

  for (const dependency of Object.keys({ ...dependencies, ...devDependencies })) {
    const packageJsonPath = require.resolve(path.join(dependency, "package.json"));

    const dependencyCommandDir = path.resolve(path.dirname(packageJsonPath), "porter");

    const [, name] = dependency.match(/porter-([a-zA-Z]+)-tools/) ?? [];

    if (name && fs.existsSync(dependencyCommandDir)) {
      cli.command({
        command: name,
        // @ts-ignore 'description' exists, TS is drunk
        description: `The ${name} tool`,
        builder: (yargs) => yargs.commandDir(dependencyCommandDir, { extensions: ["ts"] }),
        handler: () => cli.showHelp("log"),
      });
    }
  }
}

cli.demandCommand().help().argv;

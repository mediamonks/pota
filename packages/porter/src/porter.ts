require("./register");
import { AVAILABLE_TOOLS } from "@mediamonks/porter-dev-utils/config";
import { program } from "commander";

// version
program
  .enablePositionalOptions(true)
  .version(`porter v0.0.1`)
  .usage(`<command> [options]`)
  .option("-d, --debug", "enable debug mode");

// create
program
  .command(`create <skeleton-type> <app-name>`)
  .description(`initialize a new porter project`)
  .action((...args) => require("./create").create(...args));

// TODO: implement `upgrade` command
// upgrade
program
  .command(`upgrade`)
  .description(`upgrade an existing porter project`)
  .action(() => require("./porter"));

// tool specific commands
for (const tool of AVAILABLE_TOOLS) {
  program
    .command(`${tool} <skeleton-command>`)
    .passThroughOptions()
    .description(`${tool} command interface`)
    .action((subCommand) => require("./applyModules").applyModules(tool, subCommand));
}

program.parse(process.argv);

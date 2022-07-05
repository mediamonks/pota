import sade from 'sade';

import { readPackage } from './readPackage.js';
import { loadCommands } from './loadCommands.js';
import { createCommand } from './createCommand.js';

const root = process.cwd();

const { pota } = await readPackage(root);

// read the "pota" field from the project's package.json
// these scripts is what make commands available to pota to work with
const commandModulePaths = Array.isArray(pota) ? [...pota] : [pota];

if (commandModulePaths.length === 0) {
  throw new Error(`Could not find a configured pota scripts package in "${root}".`);
}

// load commands that are available in the different pota scripts
const commands = await loadCommands(root, commandModulePaths);

// the main cli entry point
const main = sade('pota');

// register the loaded commands (from all scripts) in sade, so they become usable
for (const [moduleName, commandModule] of Object.entries(commands)) {
  try {
    createCommand(main, root, commandModule);
  } catch (error) {
    console.error(`Failed loading '${moduleName}' as a command:`);
    throw error;
  }
}

main.parse(process.argv);

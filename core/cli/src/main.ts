import sade from 'sade';

import { readPackage } from './readPackage.js';
import { loadCommands } from './loadCommands.js';
import { createCommand } from './createCommand.js';

const root = process.cwd();

const { pota } = await readPackage(root);

const commandModulePaths = Array.isArray(pota) ? [...pota] : [pota];

if (commandModulePaths.length === 0) {
  throw new Error(`Could not find a configured pota scripts package in "${root}".`);
}

// load command modules
const commands = await loadCommands(root, commandModulePaths);

const main = sade('pota');

for (const [moduleName, commandModule] of Object.entries(commands)) {
  try {
    createCommand(main, root, commandModule);
  } catch (error) {
    console.error(`Failed loading '${moduleName}' as a command:`);
    throw error;
  }
}

main.parse(process.argv);

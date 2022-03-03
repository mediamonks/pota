import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import sade from 'sade';

import type { CommandFunction, CommandModule } from './authoring.js';
import { loadDependencies } from './loadDependencies.js';
import { readPackage } from './readPackage.js';
import { resolveModulePath } from './resolveModulePath.js';
import { isNativeClass } from './isNativeClass.js';
import { paramCase } from 'param-case';

const root = process.cwd();

let commandModulePaths: Array<string> = [];

try {
  const { pota } = await readPackage(root);

  if (Array.isArray(pota)) commandModulePaths.push(...pota);
  else commandModulePaths.push(pota);
} catch (error) {
  console.error((error as Error).message || error);
  process.exit(1);
}

if (!commandModulePaths) {
  console.error(`Could not find a configured pota scripts package in "${root}".`);
  process.exit(1);
}

let commands: Record<string, CommandModule> = {};

try {
  for (const path of commandModulePaths) {
    commands = { ...commands, ...(await import(resolveModulePath(path, root))) };
  }
} catch (error) {
  console.error('Error occurred loading one of the command modules:');
  console.error((error as Error).message || error);
}

const selfPackagePath = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const version = (await readPackage(selfPackagePath)).version ?? 'N/A';

const main = sade('pota').version(version);

for (const [moduleName, commandModule] of Object.entries(commands)) {
  try {
    if (!isNativeClass(commandModule)) {
      const commandAction: CommandFunction = commandModule;
      main.command(paramCase(commandAction.name)).action(({ _: options }) => commandAction(options));
      continue;
    }

    const command = new commandModule();

    const program = main.command(command.name);

    if (command.description) program.describe(command.description);

    const options = command.options?.();
    if (options) {
      for (const [option, { description, default: defaultValue }] of Object.entries(options)) {
        program.option(option, description, defaultValue as sade.Value);
      }
    }

    if (command.examples) {
      for (const example of command.examples) {
        program.example(example);
      }
    }

    program.action(async (options) =>
      command.action(options, await loadDependencies(command.dependsOn ?? {}, root, options)),
    );
  } catch (error) {
    console.error(`Failed loading '${moduleName}' as a command:`);
    console.error((error as Error).message || error);
  }
}

main.parse(process.argv);

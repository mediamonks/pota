import { resolve } from 'path';
import { pathToFileURL } from 'url';
import { readFile } from 'fs/promises';

import sade from 'sade';

const root = process.cwd();

const potaConfigPath = resolve(root, '.pota/config.js');

const potaConfig = (await import(pathToFileURL(potaConfigPath).toString())).default;

let skeleton = 'unknown';

try {
  skeleton = JSON.parse(
    await readFile(resolve((potaConfig.extends ?? potaConfig).dirname, "..", 'package.json'), { encoding: 'utf8' }),
  ).name;
} catch {}

const main = sade('pota');

for (const [command, { options, examples, description, action }] of Object.entries(
  potaConfig.commands ?? {},
) as any[]) {
  if (!action || typeof action !== 'function') continue;

  const program = main.command(command);

  program.describe(description);

  if (options) {
    for (const o of options) program.option(o.option, o.description, o.default);
  }
  if (examples) {
    for (const example of examples) program.example(example);
  }

  program.action(action.bind({ meta: potaConfig.meta, skeleton }));
}

main.parse(process.argv);

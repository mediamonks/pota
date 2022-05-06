import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
// eslint-disable-next-line import/no-extraneous-dependencies
import minimist from 'minimist';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Plop, run } from 'plop';

const args = process.argv.slice(2);
const argv = minimist(args);

// eslint-disable-next-line unicorn/prevent-abbreviations
const scriptsDir = dirname(fileURLToPath(import.meta.url));

Plop.prepare(
  {
    cwd: argv.cwd,
    configPath: path.join(scriptsDir, '..', 'plopfile.ts'),
    preload: argv.preload || [],
    completion: argv.completion,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (environment) => Plop.execute(environment, run as any),
);

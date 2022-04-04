import { build } from 'esbuild';
import minimist from 'minimist';

import { paths } from './paths.js';

async function compilePlopfile() {
  await build({
    entryPoints: [paths.plopfile],
    loader: { '.ts': 'ts' },
    outfile: paths.compiledPlopfile,
  });
}

export async function plop() {
  // edit the global `process.argv` and remove the pota `plop` subcommand
  // this is because `Plop` parses `process.argv` again by itself
  // and it would break, if we wouldn't remove the subcommand
  process.argv = process.argv.filter((a) => a !== 'plop');

  // import `plop` stuff only after we have
  // edited `process.argv` as it parses it on module load
  const [{ Plop, run }] = await Promise.all([import('plop'), compilePlopfile] as const);

  const args = process.argv.slice(2);
  const argv = minimist(args);

  Plop.prepare(
    {
      cwd: paths.user ?? argv.cwd,
      configPath: paths.compiledPlopfile,
      preload: argv.preload ?? [],
      completion: argv.completion,
    },
    (env) => Plop.execute(env, (...params) => run(...params, false)),
  );
}

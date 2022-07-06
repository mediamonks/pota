import { unlinkSync } from 'fs';

import { paths } from './paths.js';

async function compilePlopfile() {
  const { build } = await import('esbuild');
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
  const [{ Plop, run }, { default: minimist }] = await Promise.all([
    import('plop'),
    import('minimist'),
    compilePlopfile(),
  ] as const);

  process.on('SIGTERM', onExit);
  process.on('SIGINT', onExit);
  process.on('exit', onExit);
  process.on('error', onExit);

  const args = process.argv.slice(2);
  const argv = minimist(args);

  Plop.prepare(
    {
      cwd: paths.user ?? argv.cwd,
      configPath: paths.compiledPlopfile,
      preload: argv.preload ?? [],
      completion: argv.completion,
    },
    (env) =>
      Plop.execute(env, (options) =>
        run({ ...options, dest: paths.user } as any, undefined, false),
      ),
  );
}

// cleanup compiled file on program exit
function onExit() {
  unlinkSync(paths.compiledPlopfile);
}

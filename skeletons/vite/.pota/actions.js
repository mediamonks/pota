import logSymbols from 'log-symbols';
import kleur from 'kleur';

import * as vite from 'vite';

const { cyan } = kleur;

export async function build(options, config, skeleton) {
  console.log(logSymbols.info, `Using ${cyan(skeleton)} configuration`);

  console.log('Building...');

  await vite.build(config);
}

export async function dev(options, config, skeleton) {
  console.log(logSymbols.info, `Using ${cyan(skeleton)} configuration`);

  const server = await vite.createServer(config);

  console.log(cyan('Starting the development server...'));

  await server.listen();

  server.printUrls();
}

export async function preview(options, config, skeleton) {
  console.log(logSymbols.info, `Using ${cyan(skeleton)} configuration`);

  const server = await vite.preview(config);

  console.log(cyan('Starting the preview server...'));

  server.printUrls();
}

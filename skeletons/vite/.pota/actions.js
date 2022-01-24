import logSymbols from 'log-symbols';
import kleur from 'kleur';
import * as vite from 'vite';

const { cyan } = kleur;

export async function build(config, skeleton) {
  console.log(logSymbols.info, `Using ${cyan(skeleton)} configuration`);
  console.log(); // spacing

  await vite.build(config);
}

export async function dev(config, skeleton) {
  console.log(logSymbols.info, `Using ${cyan(skeleton)} configuration`);
  console.log(); // spacing

  const server = await vite.createServer(config);
  await server.listen();

  server.printUrls();
}

export async function preview(config, skeleton) {
  console.log(logSymbols.info, `Using ${cyan(skeleton)} configuration`);
  console.log(); // spacing

  const server = await vite.preview(config);

  server.printUrls();
}

import { resolve } from 'path';

import logSymbols from 'log-symbols';
import Server from 'webpack-dev-server';
import kleur from 'kleur';
import webpack from 'webpack';
import getPort, { portNumbers } from 'get-port';

const { red, green, cyan } = kleur;

import * as paths from './paths.js';

export async function build(options, config, skeleton) {
  console.log(logSymbols.info, `Using ${cyan(skeleton)} configuration`);

  console.log('Building...');

  const compiler = await createCompiler(config);
  if (!compiler) return;

  if (options.watch) {
    compiler.watch({}, (...watchArgs) => buildFinish(...watchArgs));
    return;
  }

  compiler.run((...runArgs) =>
    buildFinish(...runArgs, () => {
      console.log();
      console.log(logSymbols.info, 'Closing compiler...');
      compiler.close((error) => {
        if (error) {
          console.error(logSymbols.error, 'Error occurred closing the compiler 😕');
          console.error(error);
        }
      });
    }),
  );
}

export async function dev(options, config, skeleton) {
  console.log(logSymbols.info, `Using ${cyan(skeleton)} configuration`);

  const port = await parsePort(options.port);

  if (isNumber(options.port) && port !== options.port) {
    console.log(
      logSymbols.warning,
      `Port ${red(options.port)} is unavailable, using ${green(port)} as a fallback.`,
    );
  }

  console.log(); // spacing
  const proxySetup = await loadProxySetup();

  const finalDevServerConfig = {
    ...getDevServerConfig(config),
    port,
    https: options.https,
    open: options.open,
    ...(proxySetup && {
      setupMiddlewares(middlewares, devServer) {
        if (!devServer) throw new Error('webpack-dev-server is not defined');

        middlewares.push(proxySetup(devServer.app));

        return middlewares;
      },
    }),
  };

  const compiler = await createCompiler(config);

  if (!compiler) return;

  const server = new Server(finalDevServerConfig, compiler);

  console.log(cyan('Starting the development server...'));
  console.log(); // spacing

  await server.start();
}

function isNumber(value) {
  return typeof value === 'number';
}

function buildFinish(error, stats, onFinish) {
  if (!error && stats?.hasErrors()) error = stats.toJson({ colors: true })?.errors;

  if (error) console.error(error);
  else console.log(stats?.toString({ colors: true, chunks: false }));

  onFinish?.();
}

async function parsePort(port) {
  if (isNumber(port)) return port;

  return getPort(port ? { port: portNumbers(port, port + 100) } : undefined);
}

function getDevServerConfig(config) {
  return (Array.isArray(config) ? config : [config]).find(({ devServer }) => devServer).devServer;
}

async function loadProxySetup() {
  try {
    const setup = (await import(resolve(paths.user, 'setupProxy.js'))).default;

    if (typeof setup !== 'function') {
      throw new Error('`setupProxy.js` should export default a function.');
    }

    return setup;
  } catch (error) {
    if (error.code !== 'ERR_MODULE_NOT_FOUND') console.warn(error);

    return null;
  }
}

async function createCompiler(config) {
  try {
    return webpack(config);
  } catch (error) {
    console.error(red('Failed to initialize compiler.'));
    console.log();
    console.error(error.message || error);
    console.log();
    return null;
  }
}

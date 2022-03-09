import { defineOptions } from '@pota/cli/authoring';
import { isNumber } from 'isntnt';

import type { Stats } from 'webpack';
import type { Command } from '@pota/cli/authoring';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';

import { parsePort } from './parsePort.js';
import { loadProxySetup } from './loadProxySetup.js';
import { createCompiler } from './createCompiler.js';
import { createLogger } from './createLogger.js';
import { paths } from './paths.js';

import type { WebpackConfig } from './config.js';
import type { CommonOptions, BuildOptions, DevOptions } from './types.js';

const commonOptions = defineOptions<CommonOptions>({
  'public-path': {
    description: 'The location of static assets on your production server.',
    default: '/',
  },
  'image-compression': {
    description: 'Toggles image compression.',
    default: true,
  },
  typecheck: {
    description: 'typecheck',
    default: false,
  },
  'source-map': {
    description:
      'Sets the style of source-map, for enhanced debugging. Disable or use faster options in you are having out of memory or other performance issues. (https://webpack.js.org/configuration/devtool/#devtool)',
    default: 'eval-source-map',
  },
  cache: {
    description:
      "Toggles webpack's caching behavior. (https://webpack.js.org/configuration/cache/)",
    default: true,
  },
});

function buildFinish(error: unknown, stats?: Stats, onFinish?: () => void) {
  if (!error && stats?.hasErrors()) error = stats.toJson({ colors: true })?.errors;

  if (error) console.error(error);
  else console.log(stats?.toString({ colors: true, chunks: false }));

  onFinish?.();
}

type Dependencies = { config: WebpackConfig };

export class Build implements Command<BuildOptions, Dependencies> {
  name = 'build';
  description = 'Builds the app for production.';
  dependsOn = { config: 'config.js' };

  options() {
    return {
      ...commonOptions,
      debug: {
        description: "Sets NODE_ENV to 'development'.",
        default: false,
      },
      analyze: {
        description: 'When enabled, will open a bundle report after bundling.',
        default: false,
      },
      watch: {
        description: 'Run build and watch for changes.',
        default: false,
      },
      output: {
        description: 'The build output directory.',
        default: paths.output,
      },
      versioning: {
        description:
          'When enabled, will copy assets in ./static to a versioned directory in the output (e.g. build/version/v2/static/...).',
        default: false,
      },
    };
  }

  async action(options: BuildOptions, { config }: Dependencies) {
    process.env.NODE_ENV = options.debug ? 'development' : 'production';

    const log = await createLogger();

    const compiler = await createCompiler(await config.final());
    if (!compiler) return;

    if (options.watch) {
      compiler.watch({}, (...watchArgs) => buildFinish(...watchArgs));
      return;
    }

    compiler.run((...runArgs) =>
      buildFinish(...runArgs, () => {
        log();

        log.info('Closing compiler...');

        compiler.close((error) => {
          if (error) log.error('Error occurred closing the compiler 😕', error?.message || error);
        });
      }),
    );
  }
}

export class Dev implements Command<DevOptions, Dependencies> {
  name = 'dev';
  description = 'Starts the development server.';
  dependsOn = { config: 'config.js' };

  options() {
    return {
      ...commonOptions,
      prod: {
        description: "Sets NODE_ENV to 'production'.",
        default: false,
      },
      https: {
        description:
          "Enables the server's listening socket for TLS (by default, dev server will be served over HTTP)",
        default: false,
      },
      open: {
        description:
          'Allows to configure dev server to open the browser after the server has been started.',
        default: true,
      },
      port: {
        description: 'Allows configuring the port.',
        default: 2001,
      },
    };
  }

  async action(options: DevOptions, { config }: Dependencies) {
    process.env.NODE_ENV = options.prod ? 'production' : 'development';

    const log = await createLogger();
    const { red, green, cyan } = log.color;

    const port = await parsePort(options.port);

    if (isNumber(options.port) && port !== options.port) {
      log.warn(`Port ${red(options.port)} is unavailable, using ${green(port)} as a fallback.`);
    }

    console.log(); // spacing
    const proxySetup = await loadProxySetup(paths.proxySetup);

    const devServerConfig = config.finalDevServer();
    const finalDevServerConfig: DevServerConfiguration = {
      ...devServerConfig,
      port,
      https: options.https,
      open: options.open,
      ...(proxySetup && {
        setupMiddlewares(middlewares, devServer) {
          if (!devServer) throw new Error('webpack-dev-server is not defined');

          if (devServerConfig.setupMiddlewares) {
            middlewares.unshift(
              ...(devServerConfig.setupMiddlewares(middlewares, devServer) ?? []),
            );
          }

          middlewares.unshift(proxySetup(devServer.app!));

          return middlewares;
        },
      }),
    };

    const compiler = await createCompiler(await config.final());
    if (!compiler) return;

    const Server = (await import('webpack-dev-server')).default;

    const server = new Server(finalDevServerConfig, compiler);

    console.log(cyan('Starting the development server...'));
    console.log(); // spacing

    await server.start();
  }
}

export { BuildOptions, DevOptions };

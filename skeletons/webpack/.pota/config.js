import { fileURLToPath } from 'url';
import { relative, isAbsolute, resolve, dirname } from 'path';

import { define } from '@pota/authoring';

import * as paths from './paths.js';

const commonOptions = [
  define.option('typecheck', 'When disabled, will ignore type related errors.', true),
];

function preprocessOptions(options) {
  if (options.output && !isAbsolute(options.output)) {
    return { ...options, output: resolve(options.output) };
  }

  return options;
}

export default define({
  dirname: dirname(fileURLToPath(import.meta.url)),
  scripts: ['typecheck', 'fix', 'fix:eslint', 'format', 'lint', 'lint:eslint', 'rsync'],
  rename: {
    gitignore: '.gitignore',
  },
  commands: {
    dev: {
      options: [
        ...commonOptions,
        define.option(
          'https',
          "Enables the server's listening socket for TLS (by default, dev server will be served over HTTP)",
          false,
        ),
        define.option(
          'open',
          'Allows to configure dev server to open the browser after the server has been started.',
          true,
        ),
        define.option('port', 'Allows configuring the port.', 2001),
        define.option(
          'cache',
          "Toggles webpack's caching behavior. (https://webpack.js.org/configuration/cache/)",
          true,
        ),
        define.option('prod', "Sets NODE_ENV to 'production'."),
        define.option(
          'source-map',
          'Sets the style of source-map, for enhanced debugging. Disable or use faster options in you are having out of memory or other performance issues. (https://webpack.js.org/configuration/devtool/#devtool)',
        ),
      ],
      async action(options) {
        process.env.NODE_ENV = options.prod ? 'production' : 'development';

        const babelConfig = await this.meta.babel(options);
        const config = await this.meta.webpack(options, babelConfig);

        await (await import('./actions.js')).dev(options, config, this.skeleton);
      },
    },
    build: {
      options: [
        define.option('analyze', 'When enabled, will open a bundle report after bundling.'),
        define.option('watch', 'Run build and watch for changes.'),
        define.option(
          'cache',
          "Toggles webpack's caching behavior. (https://webpack.js.org/configuration/cache/)",
          true,
        ),
        define.option('debug', "Sets NODE_ENV to 'development'."),
        define.option('output', 'The build output directory.', relative(paths.user, paths.output)),
        define.option(
          'source-map',
          'Sets the style of source-map, for enhanced debugging. Disable or use faster options in you are having out of memory or other performance issues. (https://webpack.js.org/configuration/devtool/#devtool)',
        ),
        define.option(
          'public-path',
          'The location of static assets on your production server.',
          '/',
        ),
        define.option(
          'versioning',
          'When enabled, will copy assets in ./static to a versioned directory in the output (e.g. build/version/v2/static/...).',
          false,
        ),
      ],
      async action(options) {
        options = preprocessOptions(options);

        process.env.NODE_ENV = options.debug ? 'development' : 'production';

        const babelConfig = await this.meta.babel(options);
        const config = await this.meta.webpack(options, babelConfig);

        await (await import('./actions.js')).build(options, config, this.skeleton);
      },
    },
  },
  meta: {
    async babel() {
      const presetEnv = (await import('@babel/preset-env')).default;

      return {
        presets: [
          [
            presetEnv,
            {
              useBuiltIns: 'usage',
              bugfixes: true,
              corejs: 3, // Set the corejs version we are using to avoid warnings in console
            },
          ],
        ],
      };
    },
    async webpack(options, babelConfig) {
      const createConfig = (await import('./webpack.config.js')).default;

      return createConfig(options, babelConfig);
    },
  },
});

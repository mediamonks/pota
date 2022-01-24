import { fileURLToPath } from 'url';
import { dirname, relative } from 'path';

import { define } from '@pota/authoring';

import * as paths from './paths.js';

const commonOptions = [
  define.option('public-path', 'The location of static assets on your production server.', '/'),
  define.option(
    'log-level',
    'Adjust console output verbosity. (https://vitejs.dev/config/#loglevel)',
    'info',
  ),
];

const commonDevAndBuildOptions = [
  define.option('force', 'Ignore pre-bundled dependencies (the node_modules/.vite cache).', false),
];

const commonDevAndPreviewOptions = [
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
  define.option('cors', 'Enable CORS.', false),
];

export default define({
  dirname: dirname(fileURLToPath(import.meta.url)),
  scripts: ['typecheck', 'fix', 'fix:eslint', 'format', 'lint', 'lint:eslint', 'rsync'],
  rename: {
    gitignore: '.gitignore',
  },
  commands: {
    dev: {
      description: 'Starts the vite development server.',
      options: [
        ...commonOptions,
        ...commonDevAndBuildOptions,
        ...commonDevAndPreviewOptions,
        define.option('prod', "Sets NODE_ENV to 'production'."),
      ],
      async action(options) {
        const { dev } = await import('./actions.js');
        const config = await this.meta.vite(options);

        await dev(config, this.skeleton);
      },
    },
    build: {
      description: 'Builds the project using vite.',
      options: [
        ...commonOptions,
        ...commonDevAndBuildOptions,
        define.option('debug', "Sets NODE_ENV to 'development'.", false),
        define.option('output', 'The build output directory.', relative(paths.user, paths.output)),
        define.option('source-map', 'Enable source-map generation.', false),
      ],
      async action(options) {
        const { build } = await import('./actions.js');
        const config = await this.meta.vite(options);

        await build(config, this.skeleton);
      },
    },
    preview: {
      description: 'Serves the /dist directory.',
      options: [...commonOptions, ...commonDevAndPreviewOptions],
      async action(options) {
        const { preview } = await import('./actions.js');
        const config = await this.meta.vite(options);

        await preview(config, this.skeleton);
      },
    },
  },
  meta: {
    async vite(options) {
      const { defineConfig } = await import('vite');

      let mode = undefined;
      if (options['debug']) mode = 'development';
      else if (options['prod']) mode = 'production';

      return defineConfig({
        ...(mode && { mode }),
        base: options['public-path'],
        logLevel: options['log-level'],
        server: {
          host: options['host'],
          open: options['open'],
          https: options['https'],
          port: options['port'],
          force: options['force'],
          cors: options['cors'],
        },
        build: {
          sourcemap: options['source-map'],
          ...(options['output'] && { outDir: options['output'] }),
        },
      });
    },
  },
});

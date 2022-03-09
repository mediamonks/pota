import { defineOptions } from '@pota/cli/authoring';

import type { Command } from '@pota/cli/authoring';

import { paths } from './paths.js';

import type { ViteConfig } from './config.js';
import type {
  CommonOptions,
  BuildOptions,
  DevOptions,
  PreviewOptions,
  DevAndPreviewOptions,
  DevAndBuildOptions,
} from './types.js';

const commonOptions = defineOptions<CommonOptions>({
  'public-path': {
    description: 'The location of static assets on your production server.',
    default: '/',
  },
  'log-level': {
    description: 'Adjust console output verbosity. (https://vitejs.dev/config/#loglevel)',
    default: 'info',
  },
});

const devAndPreviewOptions = defineOptions<DevAndPreviewOptions>({
  host: {
    description: 'Specify which IP addresses the server should listen on.',
    default: '127.0.0.1',
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
  port: { description: 'Allows configuring the port.', default: 2001 },
  cors: { description: 'Enable CORS.', default: false },
});

const devAndBuildOptions = defineOptions<DevAndBuildOptions>({
  force: {
    description: 'Ignore pre-bundled dependencies (the node_modules/.vite cache).',
    default: false,
  },
});

type Dependencies = { config: ViteConfig };

export class Build implements Command<BuildOptions, Dependencies> {
  name = 'build';
  description = 'Builds the app for production.';
  dependsOn = { config: 'config.js' };

  options() {
    return {
      ...commonOptions,
      ...devAndBuildOptions,
      debug: {
        description: "Sets NODE_ENV to 'development'.",
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
      'source-map': {
        description: 'Enable source-map generation',
        default: false,
      },
    };
  }

  async action(_: BuildOptions, { config }: Dependencies) {
    const { build } = await import('vite');

    build(await config.final());
  }
}

export class Dev implements Command<DevOptions, Dependencies> {
  name = 'dev';
  description = 'Starts the development server.';
  dependsOn = { config: 'config.js' };

  options() {
    return {
      ...commonOptions,
      ...devAndBuildOptions,
      ...devAndPreviewOptions,
      prod: {
        description: "Sets NODE_ENV to 'production'.",
        default: false,
      },
    };
  }

  async action(_: DevOptions, { config }: Dependencies) {
    const { createServer } = await import('vite');

    const server = await createServer(await config.final());
    await server.listen();

    server.printUrls();
  }
}

export class Preview implements Command<PreviewOptions, Dependencies> {
  name = 'preview';
  description = 'Locally preview the production build.';
  dependsOn = { config: 'config.js' };

  options() {
    return { ...commonOptions, ...devAndBuildOptions, ...devAndPreviewOptions };
  }

  async action(_: PreviewOptions, { config }: Dependencies) {
    const { preview } = await import('vite');

    const server = await preview(await config.final());

    server.printUrls();
  }
}

export { BuildOptions, DevOptions, PreviewOptions };

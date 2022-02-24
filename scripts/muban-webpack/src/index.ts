import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import type { MubanWebpackConfig } from './config.js';

import type { Command, OptionsToOptionsDef } from '@pota/cli/authoring';

import {
  Build as WebpackBuild,
  BuildOptions as WebpackBuildOptions,
  Dev as WebpackDev,
  DevOptions as WebpackDevOptions,
} from '@pota/webpack-scripts';

type CommonOptions = {
  'mock-api': boolean;
};

const commonOptions: OptionsToOptionsDef<CommonOptions> = {
  'mock-api': {
    description: 'Toggles support for building API mocks',
    default: false,
  },
};

export type BuildOptions = WebpackBuildOptions &
  CommonOptions & {
    preview: boolean;
  };

type Dependencies = { config: MubanWebpackConfig };

const SELF_DIRNAME = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATHS = ['pota.config.js', join(SELF_DIRNAME, 'config.js')];

export class Build extends WebpackBuild implements Command<BuildOptions, Dependencies> {
  dependsOn = { config: CONFIG_PATHS };

  options() {
    const superOptions = super.options();
    return {
      ...superOptions,
      ...commonOptions,
      output: {
        ...superOptions.output,
        default: 'dist/site',
      },
      preview: {
        description: 'Toggles support for building the preview',
        default: false,
      },
    };
  }
}

export type DevOptions = WebpackDevOptions & CommonOptions;

export class Dev extends WebpackDev implements Command<DevOptions, Dependencies> {
  dependsOn = { config: CONFIG_PATHS };

  options() {
    const superOptions = super.options();
    return {
      ...superOptions,
      ...commonOptions,
      port: {
        ...superOptions.port,
        default: 9000,
      },
    };
  }
}

import { defineOptions, localPath } from '@pota/cli/authoring';
import {
  Build as WebpackBuild,
  BuildOptions as WebpackBuildOptions,
  Dev as WebpackDev,
  DevOptions as WebpackDevOptions,
} from '@pota/webpack-scripts';

import type { Command } from '@pota/cli/authoring';

import type { MubanWebpackConfig } from './config.js';


type CommonOptions = {
  'mock-api': boolean;
};

const commonOptions = defineOptions<CommonOptions>({
  'mock-api': {
    description: 'Toggles support for building API mocks',
    default: false,
  },
})

export type BuildOptions = WebpackBuildOptions &
  CommonOptions & {
    preview: boolean;
  };

type Dependencies = { config: MubanWebpackConfig };

const CONFIG_PATHS = ['pota.config.js', localPath(import.meta.url, 'config.js')];

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

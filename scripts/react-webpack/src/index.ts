import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import type { Command } from '@pota/cli/authoring';
import {
  Build as WebpackBuild,
  BuildOptions as WebpackBuildOptions,
  Dev as WebpackDev,
  DevOptions,
} from '@pota/webpack-scripts';
import type { ReactWebpackConfig } from './config.js';

type BuildOptions = WebpackBuildOptions & {
  profile: boolean;
};

type Dependencies = { config: ReactWebpackConfig };

const SELF_DIRNAME = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATHS = ['pota.config.js', join(SELF_DIRNAME, 'config.js')];

export class Build extends WebpackBuild implements Command<BuildOptions, Dependencies> {
  dependsOn = { config: CONFIG_PATHS };

  options() {
    return {
      ...super.options(),
      profile: {
        description: 'Toggles support for React Devtools in _production_',
        default: false,
      },
    };
  }
}

export class Dev extends WebpackDev implements Command<DevOptions, Dependencies> {
  dependsOn = { config: CONFIG_PATHS };
}

export { BuildOptions, DevOptions };

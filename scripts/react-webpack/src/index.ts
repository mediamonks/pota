import { Build as WebpackBuild, BuildOptions as WebpackBuildOptions } from '@pota/webpack-scripts';

import type { Command } from '@pota/cli/authoring';

export type BuildOptions = WebpackBuildOptions & {
  profile: boolean;
};

export class Build extends WebpackBuild implements Command<BuildOptions> {
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

export { DevOptions, Dev } from '@pota/webpack-scripts'

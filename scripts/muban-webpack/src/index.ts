import { readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import cpx from 'cpx';
import { paths } from './paths.js';
import { defineOptions } from '@pota/cli/authoring';
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
});

export type BuildOptions = WebpackBuildOptions &
  CommonOptions & {
    preview: boolean;
  };

type Dependencies = { config: MubanWebpackConfig };

export class Build extends WebpackBuild implements Command<BuildOptions, Dependencies> {
  dependsOn = { config: 'config.js' };

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
  dependsOn = { config: 'config.js' };

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

export type CopyTwigOptions = {
  'include-server': boolean;
};

export class CopyTwig implements Command<CopyTwigOptions> {
  name = 'copy-twig';
  description = 'Copy twig files to the dist folder';
  dependsOn = {};

  options() {
    return {
      'include-server': {
        description: 'Included the configuration files for running the Twig Server',
        default: false,
      },
    };
  }

  async action(options: CopyTwigOptions) {
    this.copyTwigTemplates();

    if (options['include-server']) {
      this.copyTwigConfiguration();
      this.createTwigServer();
    }
  }

  copyTwigTemplates() {
    console.info('Copying twig files to dist folder');

    cpx.copySync(
      join(paths.source, 'components', '**/*.twig'),
      join(paths.twigOutputDir, 'templates'),
    );
  }

  copyTwigConfiguration() {
    console.info('Copying twig extensions to dist folder');

    cpx.copySync(
      join(paths.user, 'config', 'twig', '**/*'),
      join(paths.twigOutputDir, 'extensions'),
    );
  }

  createTwigServer() {
    const packageJsonPath = resolve(process.cwd(), 'package.json');
    const packageJsonConfig =
      JSON.parse(readFileSync(packageJsonPath, { encoding: 'utf8' }))?.config ?? {};

    const packagesToInstall = ['lodash', 'clsx']
      .concat(packageJsonConfig['twig-server-packages'] ?? [])
      .join(' ');

    const content = `
import { execSync } from "child_process";

${
  packagesToInstall.length > 0
    ? `execSync('npm init --yes && GIT_SSH_COMMAND="ssh" npm i --no-fund --no-audit ${packagesToInstall}', { stdio: [0, 1, 2] });`
    : ''
}

execSync('npx --yes @pota/twig-server -c -u -s ./twig-socket -e ./extensions/twig-extensions.cjs', { stdio: [0, 1, 2] });
`;

    writeFileSync(join(paths.output, 'node', 'twig.mjs'), content, 'utf8');
  }
}

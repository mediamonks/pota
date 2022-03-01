import { localPath } from '@pota/cli/authoring';
import {
  Build as ViteBuild,
  BuildOptions,
  Dev as ViteDev,
  DevOptions,
  Preview as VitePreview,
  PreviewOptions,
} from '@pota/vite-scripts';

import type { Command } from '@pota/cli/authoring';
import type { ReactViteConfig } from './config.js';

type Dependencies = { config: ReactViteConfig };

const CONFIG_PATHS = ['pota.config.js', localPath(import.meta.url, 'config.js')];

export class Build extends ViteBuild implements Command<BuildOptions, Dependencies> {
  dependsOn = { config: CONFIG_PATHS };
}

export class Dev extends ViteDev implements Command<DevOptions, Dependencies> {
  dependsOn = { config: CONFIG_PATHS };
}

export class Preview extends VitePreview implements Command<PreviewOptions, Dependencies> {
  dependsOn = { config: CONFIG_PATHS };
}

export { BuildOptions, DevOptions, PreviewOptions };

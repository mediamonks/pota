import { ViteConfig, ViteConfigOptions } from '@pota/vite-scripts/config';
import viteReact from '@vitejs/plugin-react';
import { defineConfig, UserConfig } from 'vite';

import { paths } from './paths.js';

export class ReactViteConfig extends ViteConfig {
  public get entry() {
    return paths.entry;
  }

  public async plugins() {
    return [(viteReact as unknown as Function)(), ...(await super.plugins())];
  }

  public async final() {
    const superConfig = await super.final();

    return defineConfig({
      ...superConfig,
      optimizeDeps: { include: ['react/jsx-runtime'] },
    }) as UserConfig;
  }
}

export default (options: ViteConfigOptions) => new ReactViteConfig(options);

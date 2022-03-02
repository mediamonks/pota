import { ViteConfig, ViteConfigOptions } from '@pota/vite-scripts/config';
import formatJsBabelPlugin from 'babel-plugin-formatjs';
import { defineConfig, UserConfig } from 'vite';

import { paths } from './paths.js';

export class ReactViteConfig extends ViteConfig {
  public get entry() {
    return paths.entry;
  }

  public get babelConfig() {
    return {
      plugins: [
        [
          formatJsBabelPlugin.default,
          {
            idInterpolationPattern: '[sha512:contenthash:base64:6]',
            ast: true,
          },
        ],
      ],
    };
  }

  public async plugins() {
    const viteReact = await (import('@vitejs/plugin-react').then(m => m.default.default));

    return [
      ...(await super.plugins()),
      ...viteReact({
        babel: this.babelConfig,
      }),
    ];
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

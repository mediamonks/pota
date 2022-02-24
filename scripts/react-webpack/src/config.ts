import { WebpackConfig, WebpackConfigOptions } from '@pota/webpack-scripts/config';
import { paths } from './paths.js';
import type { RuleSetRule } from 'webpack';

import babelPresetReact from '@babel/preset-react';
import babelPluginNamedAssetImport from 'babel-plugin-named-asset-import';
import babelReactRefresh from 'react-refresh/babel.js';

export interface ReactWebpackConfigOptions extends WebpackConfigOptions {
  profile: boolean;
}

export class ReactWebpackConfig extends WebpackConfig<ReactWebpackConfigOptions> {
  public get babelConfig() {
    const { presets = [] } = super.babelConfig;

    return {
      presets: [...presets, [babelPresetReact]],
      plugins: [
        [
          babelPluginNamedAssetImport,
          {
            loaderMap: { svg: { ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]' } },
          },
        ],
        this.isDev && [babelReactRefresh],
      ].filter(Boolean),
    };
  }

  public async plugins() {
    if (!this.isDev) return super.plugins();

    const [plugins, ReactRefreshPlugin] = await Promise.all([
      super.plugins(),
      import('@pmmmwh/react-refresh-webpack-plugin').then((m) => m.default),
    ]);

    return [...plugins, new ReactRefreshPlugin({ overlay: false })];
  }

  public get alias() {
    return {
      '@': paths.source,
      ...(this.options.profile && {
        'react-dom$': 'react-dom/profiling',
        'scheduler/tracing': 'scheduler/tracing-profiling',
      }),
    };
  }

  public get entry() {
    return paths.entry;
  }

  public get svgRule(): RuleSetRule {
    return {
      test: super.svgRule.test,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            prettier: false,
            svgoConfig: {
              plugins: [{ removeViewBox: false }],
            },
            titleProp: true,
            ref: true,
          },
        },
        { loader: 'url-loader' },
      ],
    };
  }
}

export default (options: ReactWebpackConfigOptions) => new ReactWebpackConfig(options);

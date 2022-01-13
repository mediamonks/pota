import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { define } from '@pota/authoring';
import webpackSkeleton from '@pota/webpack-skeleton';

const commonOptions = [
  define.option(
    'vue-options-api',
    'Toggles the Vue Options API (https://v3.vuejs.org/api/options-api).',
    false,
  ),
];

function parseOptions(options) {
  let { ['vue-options-api']: optionsApi = false, ['vue-prod-devtools']: prodDevTools = false } =
    options;

  if (optionsApi === 'false') optionsApi = false;
  if (prodDevTools === 'false') prodDevTools = false;

  return { optionsApi, prodDevTools };
}

export default define(webpackSkeleton, {
  dirname: dirname(fileURLToPath(import.meta.url)),
  commands: {
    build: {
      options: [
        ...commonOptions,
        define.option(
          'vue-prod-devtools',
          'Toggles support for the Vue Devtools in _production_',
          false,
        ),
      ],
    },
    dev: {
      options: commonOptions,
    },
  },
  meta: {
    async webpack(options, babelConfig) {
      const [config, { DefinePlugin }, { VueLoaderPlugin }] = await Promise.all([
        webpackSkeleton.meta.webpack(options, babelConfig),
        import('webpack'),
        import('vue-loader'),
      ]);

      const { optionsApi, prodDevTools } = parseOptions(options);

      return {
        ...config,
        module: {
          ...config.module,
          rules: [
            {
              test: /\.vue$/,
              loader: 'vue-loader',
            },
            ...config.module.rules,
          ],
        },
        resolve: {
          ...config.resolve,
          extensions: [...config.resolve.extensions, '.vue'],
        },
        plugins: [
          ...config.plugins,
          new DefinePlugin({
            __VUE_OPTIONS_API__: optionsApi,
            __VUE_PROD_DEVTOOLS__: prodDevTools,
          }),
          new VueLoaderPlugin(),
        ],
      };
    },
  },
});

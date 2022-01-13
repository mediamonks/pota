import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { define } from '@pota/authoring';
import webpackSkeleton from '@pota/webpack-skeleton';

function parseOptions(options) {
  let { profile = false } = options;

  if (profile === 'false') profile = false;

  return { profile };
}

const SVG_TEST = /\.(svg)(\?.*)?$/;

export default define(webpackSkeleton, {
  dirname: dirname(fileURLToPath(import.meta.url)),
  omit: ['src/main.ts'],
  commands: {
    build: {
      options: [define.option('profile', 'Toggles support for React Devtools in _production_')],
    },
  },
  meta: {
    babel() {
      const { presets = [], plugins = [] } = webpackSkeleton.babel();

      const isDev = process.env.NODE_ENV === 'development';

      return {
        presets: [...presets, ['@babel/preset-react']],
        plugins: [
          ...plugins,
          [
            'babel-plugin-named-asset-import',
            {
              loaderMap: { svg: { ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]' } },
            },
          ],
          isDev && ['react-refresh/babel'],
        ].filter(Boolean),
      };
    },
    async webpack(options, babelConfig) {
      const [config, { default: ReactRefreshPlugin }] = await Promise.all([
        webpackSkeleton.webpack(options, babelConfig),
        import('@pmmmwh/react-refresh-webpack-plugin'),
      ]);

      const isDev = config.mode
        ? config.mode === 'development'
        : process.env.NODE_ENV === 'development';

      const { profile } = parseOptions(options);

      return {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...config.resolve.alias,
            ...(profile && {
              'react-dom$': 'react-dom/profiling',
              'scheduler/tracing': 'scheduler/tracing-profiling',
            }),
          },
        },
        entry: config.entry.replace('.ts', '.tsx'),
        module: {
          rules: config.module.rules.map((rule) => {
            if (String(rule.test) === String(SVG_TEST)) {
              return {
                test: SVG_TEST,
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

            return { ...rule, use: use ?? rule.use };
          }),
        },
        plugins: [...config.plugins, isDev && new ReactRefreshPlugin({ overlay: false })].filter(
          Boolean,
        ),
      };
    },
  },
});

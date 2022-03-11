import { readdir } from 'fs/promises';
import { basename, extname, join, resolve } from 'path';

import { isString } from 'isntnt';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import historyApiFallback from 'connect-history-api-fallback';
import { createMockMiddleware } from '@mediamonks/monck';

import { WebpackConfigOptions, WebpackConfig } from '@pota/webpack-scripts/config';

import type { Configuration, RuleSetRule, WebpackPluginInstance } from 'webpack';
import type {
  Configuration as DevServerConfiguration,
  ExpressRequestHandler,
} from 'webpack-dev-server';

import { paths } from './paths.js';
import MubanPagePlugin from './webpack/plugins/MubanPagePlugin.js';
import EmitMockMainPlugin from './webpack/plugins/EmitMockMainPlugin.js';
import CopyEmittedAssetsPlugin from './webpack/plugins/CopyEmittedAssetsPlugin.js';

function createFindPlugin(plugins: ReadonlyArray<WebpackPluginInstance>) {
  return (name: string) => plugins.find((plugin) => plugin.constructor.name === name);
}

class Recursive {
  static async readdir(dir: string): Promise<ReadonlyArray<string>> {
    const files = await readdir(dir, { withFileTypes: true });
    const finalFiles = [];

    for (const file of files) {
      if (file.isFile()) finalFiles.push(file.name);
      else if (file.isDirectory()) {
        // sub files come in relative to `file.name`
        const subFiles = await Recursive.readdir(join(dir, file.name));
        // we have to prepend the `file.name` so the path is always relative to `dir`
        finalFiles.push(...subFiles.map((filename) => join(file.name, filename)));
      }
    }

    return finalFiles;
  }
}

export interface MubanWebpackConfigOptions extends WebpackConfigOptions {
  preview: boolean;
  'mock-api': boolean;
}

function makeCssRuleCompatible(rule: RuleSetRule) {
  return {
    ...rule,
    use: Array.isArray(rule.use)
      ? rule.use.map((use) => {
          if (use === 'style-loader') return MiniCSSExtractPlugin.loader;
          if (!isString(use) && 'loader' in use && use.loader === 'sass-loader') {
            return {
              ...use,
              options: {
                ...(isString(use.options) ? {} : use.options),
                // TODO: this is terribly inefficient, since we're creating a single .css file there should be a better way to add global styles
                additionalData: `
                  @import "~seng-scss";
                  @import "@/styles/_global.scss";
                  `,
              },
            };
          }
          return use;
        })
      : rule.use,
  };
}

const MOCKS_NAME = 'mocks';
const PAGES_NAME = 'pages';
const MUBAN_NAME = 'muban';

export class MubanWebpackConfig extends WebpackConfig<MubanWebpackConfigOptions> {
  public finalDevServer(): DevServerConfiguration {
    const mocksDir = join(paths.mocksOutputDir, './mocks');
    const mocksHotUpdateDir = join(mocksDir, './static', './webpack');

    const useMockApi = this.options['mock-api'];

    return {
      ...super.finalDevServer(),
      static: {
        serveIndex: false,
      },
      devMiddleware: {
        writeToDisk(file) {
          return file.startsWith(mocksDir) && !file.startsWith(mocksHotUpdateDir);
        },
      },
      historyApiFallback: false,
      setupMiddlewares(middlewares, devServer) {
        if (!devServer) throw new Error('[setupMiddlewares]: `devServer` is not defined');

        middlewares.unshift({
          name: 'pages',
          path: '/',
          middleware: ((req, res, next) => {
            // @ts-expect-error, stats is available
            if (!devServer.stats) return next();

            // find all of the `.html` assets generated by the "pages" compilation (the other config)
            const pageAssets = (
              Array.from(
                // @ts-expect-error, stats is available
                devServer.stats.stats.find(({ compilation }) => compilation.name === PAGES_NAME)
                  .compilation.emittedAssets,
              ) as Array<string>
            ).filter((asset) => asset.endsWith('.html'));

            // setup redirects from paths to html files e.g. `/my/favourite/page` to `/my/favourite/page.html`
            return historyApiFallback({
              rewrites: pageAssets.map((asset) => ({
                from: new RegExp(`^\/${asset.replace('.html', '').replace('/index', '')}$`),
                to: `/${asset}`,
              })),
            })(req, res, next);
          }) as ExpressRequestHandler,
        });

        // mock middleware takes precendance over the pages one
        // as otherwise the pages middleware would overwrite the /api path
        if (useMockApi) {
          middlewares.unshift({
            name: 'monck',
            path: '/api',
            middleware: createMockMiddleware(mocksDir) as ExpressRequestHandler,
          });
        }

        return middlewares;
      },
    };
  }

  public get nodeTargetRules() {
    return [
      {
        oneOf: [
          this.jsRule,
          this.tsRule,
          this.imageRule,
          this.svgRule,
          this.mediaRule,
          // `null-loader` will make sure to ignore any accidental imports to e.g. `.css` files
          {
            exclude: [/\.(js|mjs|ts)$/, /\.html$/, /\.json$/],
            use: 'null-loader',
          },
        ],
      },
    ];
  }

  public async mubanPlugins() {
    let plugins = await super.plugins();

    const findPlugin = createFindPlugin(plugins);
    const excludedPlugins = [
      findPlugin('FaviconsWebpackPlugin'),
      findPlugin('HtmlWebpackPlugin'),
      findPlugin('MiniCssExtractPlugin'),
    ];

    plugins = plugins.filter((plugin) => !excludedPlugins.includes(plugin));
    return [
      ...plugins,
      // this plugin is generally applied only during production builds, but Muban requires a single `main.css` file 😁
      new MiniCSSExtractPlugin({
        ignoreOrder: true,
        filename: 'static/css/[name].css',
        chunkFilename: `static/css/${this.isDev ? '[id]' : '[id].[contenthash]'}.css`,
      }),
    ];
  }

  public get cssRule(): RuleSetRule {
    return makeCssRuleCompatible(super.cssRule);
  }

  public get sassRule(): RuleSetRule {
    return makeCssRuleCompatible(super.sassRule);
  }

  async mubanConfig(): Promise<Configuration> {
    const superConfig = (await super.final()) as Configuration;

    /** @type {import('webpack').Configuration} */
    return {
      ...superConfig,
      name: MUBAN_NAME,

      cache: this.options.cache && {
        ...(typeof superConfig.cache !== 'boolean' ? superConfig.cache : {}),
        type: 'filesystem',
        name: `${MUBAN_NAME}-${this.isDev ? 'development' : 'production'}`,
      },
      output: {
        ...superConfig.output,
        filename: `static/chunks/[name].js`,
      },
      optimization: {
        ...superConfig.optimization,
        runtimeChunk: undefined,
        splitChunks: {
          ...superConfig.optimization?.splitChunks,
          cacheGroups: {
            ...(superConfig.optimization?.splitChunks &&
              superConfig.optimization?.splitChunks?.cacheGroups),
            // but Muban is special and requires a single `main.css` file 😁
            styles: {
              name: 'main',
              type: 'css/mini-extract',
              chunks: 'all',
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      },
      plugins: await this.mubanPlugins(),
    } as Configuration;
  }

  public async pagesPlugins() {
    const plugins = await super.plugins();

    // we only care about compiling the `.ts` files in the `/src/pages` directory into `.html` files
    return [
      createFindPlugin(plugins)('DefinePlugin')!,
      new MubanPagePlugin({ template: resolve(paths.pagesPublic, 'index.html') }),
      new CopyPlugin({
        patterns: [
          {
            from: paths.pagesPublic,
            toType: 'dir',
            globOptions: {
              ignore: ['**/.*', resolve(paths.pagesPublic, 'index.html')],
            },
          },
        ],
      }),
    ];
  }

  async pagesConfig(): Promise<Configuration> {
    const superConfig = (await super.final()) as Configuration;

    return {
      ...superConfig,
      name: PAGES_NAME, // required so the `devServer` can find the correct compilation
      target: 'node',
      mode: 'development', // we do not care about the size of the output, it just needs to be built fast
      devtool: false, // source maps will not be used

      entry: { pages: resolve(paths.pagesSource, '_main.ts') },

      cache: this.options.cache && {
        ...(typeof superConfig.cache !== 'boolean' ? superConfig.cache : {}),
        type: 'filesystem',
        name: `${PAGES_NAME}-${this.isDev ? 'development' : 'production'}`,
      },

      output: {
        ...superConfig.output,
        // we are importing the module as a string, so we must bundle it as `commonjs`
        chunkFormat: 'commonjs',
        library: { type: 'commonjs' },
      },
      optimization: {
        minimize: false,
        moduleIds: 'named',
        runtimeChunk: undefined,
      },
      module: {
        ...superConfig.module,
        rules: this.nodeTargetRules,
      },
      plugins: await this.pagesPlugins(),
    };
  }

  public async mocksPlugins() {
    const plugins = await super.plugins();

    return [
      createFindPlugin(plugins)('DefinePlugin')!,
      new CopyPlugin({
        patterns: [
          {
            from: paths.mocksDir,
            to: join(paths.mocksOutputDir, './mocks'),
            globOptions: {
              ignore: ['**/.*', '**/*.js', '**/*.ts'],
            },
          },
        ],
      }),
      !this.isDev && new EmitMockMainPlugin(),
      !this.isDev && new CopyEmittedAssetsPlugin(/^static\//, paths.mocksOutputDir),
    ].filter((plugin): plugin is Exclude<typeof plugin, false> => Boolean(plugin));
  }

  public async monckConfig(): Promise<Configuration> {
    const superConfig = (await super.final()) as Configuration;

    const entry = Object.fromEntries(
      (await Recursive.readdir(paths.mocksDir))
        .filter((file) => extname(file) === '.ts' && !basename(file).startsWith('_'))
        .map((file) => [basename(file, extname(file)), resolve(paths.mocksDir, file)]),
    );
    return {
      ...superConfig,
      name: MOCKS_NAME, // required so the `devServer` can find the correct compilation
      target: 'node',
      mode: 'development', // we do not care about the size of the output, it just needs to be built fast
      devtool: false, // source maps will not be used

      entry,

      cache: this.options.cache && {
        ...(typeof superConfig.cache !== 'boolean' ? superConfig.cache : {}),
        type: 'filesystem',
        name: `${MOCKS_NAME}-${this.isDev ? 'development' : 'production'}`,
      },

      output: {
        ...superConfig.output,
        path: paths.mocksOutputDir,
        filename: './mocks/[name].mjs',
        chunkFilename: `./mocks/[name].chunk.mjs`,
        chunkFormat: 'commonjs',
        module: true,
        library: { type: 'module' },
      },
      experiments: { outputModule: true },
      optimization: {
        minimize: false,
        moduleIds: 'named',
        runtimeChunk: undefined,
      },
      module: {
        ...superConfig.module,
        rules: [
          {
            oneOf: this.nodeTargetRules[0].oneOf.map((rule) => {
              if (!isString(rule) && 'include' in rule) {
                return { ...rule, include: [rule.include, paths.mocksDir] };
              }

              return rule;
            }) as Array<RuleSetRule>,
          },
        ],
      },
      plugins: await this.mocksPlugins(),
    };
  }

  public async final() {
    return Promise.all(
      [
        this.mubanConfig(),
        (this.options.preview || this.isDev) && this.pagesConfig(),
        this.options['mock-api'] && this.monckConfig(),
      ].filter((config): config is Promise<Configuration> => config !== false),
    );
  }
}

export default (options: MubanWebpackConfigOptions) => new MubanWebpackConfig(options);

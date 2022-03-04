import { access } from 'fs/promises';
import { isAbsolute, resolve, join } from 'path';

import babelPresetEnv from '@babel/preset-env';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HTMLPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import WorkboxPlugin from 'workbox-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import webpack from 'webpack';

import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import type { Configuration, RuleSetRule } from 'webpack';
import type { BuildOptions, DevOptions, CommonOptions } from './types.js';

import { paths, isSubDirectory } from './paths.js';

export type WebpackConfigOptions = CommonOptions & Partial<BuildOptions> & Partial<DevOptions>;

async function exists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    // nom nom error
    return false;
  }
}

export class WebpackConfig<C extends WebpackConfigOptions = WebpackConfigOptions> {
  constructor(public readonly options: C) {}

  public get isDev() {
    return process.env.NODE_ENV === 'development';
  }

  public get isProd() {
    return process.env.NODE_ENV === 'production' || !this.isDev;
  }

  public async getEnv(extra: Record<string, unknown> = {}) {
    // https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
    const ENV_FILES = [`.env.${process.env.NODE_ENV}.local`, `.env.local`, `.env`].map((file) =>
      resolve(paths.user, file),
    );

    // Load environment variables from .env* files. Suppress warnings using silent
    // if this file is missing. dotenv will never modify any environment variables
    // that have already been set.  Variable expansion is supported in .env files.
    // https://github.com/motdotla/dotenv
    // https://github.com/motdotla/dotenv-expand
    for (const file of ENV_FILES) {
      if (await exists(file)) {
        const [dotenv, dotenvExpand] = await Promise.all([
          import('dotenv').then((m) => m.default),
          import('dotenv-expand').then((m) => m.default),
        ] as const);

        dotenvExpand.expand(dotenv.config({ path: file }));
      }
    }
    // Grab NODE_ENV and POTA_APP_* environment variables and prepare them to be
    // injected into the application via DefinePlugin in webpack configuration.
    const POTA_APP = /^POTA_APP/i;

    const raw = Object.keys(process.env)
      .filter((key) => POTA_APP.test(key))
      .reduce((env, key) => {
        env[key] = process.env[key];
        return env;
      }, extra);
    // Stringify all values so we can feed into webpack DefinePlugin
    const stringified = {
      'process.env': Object.keys(raw).reduce<Record<string, string>>((env, key) => {
        env[key] = JSON.stringify(raw[key]);
        return env;
      }, {}),
    };

    return { raw, stringified };
  }

  public get versionPath() {
    return this.options.versioning ? `version/${process.env.VERSION ?? Date.now()}/` : '';
  }

  public getStyleLoaders(preProcessor?: string, preProcessorOptions?: Record<string, unknown>) {
    return [
      this.isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
      { loader: 'css-loader', options: { importLoaders: preProcessor ? 3 : 1 } },
      { loader: 'postcss-loader' },
      ...(preProcessor
        ? [{ loader: 'resolve-url-loader' }, { loader: preProcessor, options: preProcessorOptions }]
        : []),
    ];
  }

  /**
   * Babel configuration.
   */
  public get babelConfig() {
    return {
      presets: [
        [
          babelPresetEnv,
          {
            useBuiltIns: 'usage',
            bugfixes: true,
            corejs: 3, // Set the corejs version we are using to avoid warnings in console
          },
        ],
      ],
    };
  }

  /**
   * Webpack plugins.
   */
  public async plugins() {
    const env = await this.getEnv({
      PUBLIC_PATH: this.options['public-path'] ?? '/',
      VERSIONED_STATIC: `${this.versionPath}static/`,
    });

    const useServiceWorker = this.isProd && (await exists(paths.serviceWorker));

    return [
      new HTMLPlugin({
        inject: true,
        template: resolve(paths.user, 'index.html'),
      }),
      new FaviconsWebpackPlugin({
        logo: resolve(paths.assets, 'favicon.svg'),
        manifest: resolve(paths.user, 'manifest.json'),
        inject: true,
      }),
      new FriendlyErrorsPlugin(),
      new webpack.DefinePlugin(env.stringified),
      new CopyPlugin({
        patterns: [
          {
            from: paths.publicDir,
            toType: 'dir',
            globOptions: {
              ignore: ['**/.*'],
            },
          },
          {
            from: 'static',
            to: `${this.versionPath}static`,
            noErrorOnMissing: true,
            globOptions: { ignore: ['**/.*'] },
          },
        ],
      }),
      this.options['image-compression'] &&
        new ImageMinimizerPlugin({
          minimizerOptions: {
            plugins: [
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              ['svgo'],
            ],
          },
        }),
      this.isProd &&
        new MiniCssExtractPlugin({
          filename: `${this.versionPath}static/css/[contenthash].css`,
          chunkFilename: `${this.versionPath}static/css/[contenthash].css`,
        }),
      useServiceWorker &&
        new WorkboxPlugin.InjectManifest({
          swSrc: paths.serviceWorker,
          dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
          exclude: [/\.map$/, /LICENSE/],
        }),
      this.options['typecheck'] &&
        new ForkTsCheckerWebpackPlugin({
          async: this.isDev,
          typescript: { diagnosticOptions: { semantic: true, syntactic: true } },
        }),
      this.options.analyze &&
        new BundleAnalyzerPlugin(
          typeof this.options.analyze === 'string' ? { analyzerMode: this.options.analyze } : {},
        ),
    ].filter((plugin): plugin is Exclude<typeof plugin, false | undefined> => Boolean(plugin));
  }

  /**
   * Redirect module requests.
   */
  public get alias() {
    return {
      '@': paths.source,
    };
  }

  /**
   * Folder names or directory paths where to find modules.
   * Only used when the scripts are outside of the main project directory.
   */
  public get modules() {
    const baseModules = ['node_modules', paths.selfNodeModules];

    // handle cases of different module directories when e.g. localy developing within templates
    if (isSubDirectory(paths.user, paths.selfNodeModules)) baseModules.push(paths.selfNodeModules);
    if (paths.self.endsWith('pota/scripts/webpack'))
      baseModules.push(join(paths.self, '../node_modules'));

    return baseModules;
  }

  public finalDevServer(): DevServerConfiguration {
    return {
      hot: true,
      historyApiFallback: true,
      client: {
        logging: 'none',
        progress: true,
        overlay: false,
      },
    };
  }

  public get tsRule(): RuleSetRule {
    return {
      test: /\.tsx?$/,
      include: paths.source,
      use: [
        { loader: 'babel-loader', options: this.babelConfig },
        {
          loader: 'ts-loader',
          options: {
            // makes sure to load only the files required by webpack and nothing more
            onlyCompileBundledFiles: true,
            // type checking is handled by `fork-ts-checker-webpack-plugin`
            transpileOnly: true,
            happyPackMode: true,
          },
        },
      ],
    };
  }

  public get jsRule(): RuleSetRule {
    return {
      test: /\.m?jsx?$/,
      include: paths.source,
      use: [{ loader: 'babel-loader', options: this.babelConfig }],
    };
  }

  public get cssRule(): RuleSetRule {
    // "postcss" loader applies autoprefixer to our CSS.
    // "css" loader resolves paths in CSS and adds assets as dependencies.
    // "style" loader turns CSS into JS modules that inject <style> tags.
    // In production, we use MiniCSSExtractPlugin to extract that CSS
    // to a file, but in development "style" loader enables hot editing
    // of CSS.
    return {
      test: /\.css$/,
      use: this.getStyleLoaders(),
      // Don't consider CSS imports dead code even if the
      // containing package claims to have no side effects.
      // Remove this when webpack adds a warning or an error for this.
      // See https://github.com/webpack/webpack/issues/6571
      sideEffects: true,
    };
  }

  public get sassRule(): RuleSetRule {
    // Opt-in support for SASS (using .scss or .sass extensions).
    // By default we support SASS Modules with the
    // extensions .module.scss or .module.sass
    return {
      test: /\.(scss|sass)$/,
      use: this.getStyleLoaders('sass-loader', { sourceMap: true }),
      // Don't consider CSS imports dead code even if the
      // containing package claims to have no side effects.
      // Remove this when webpack adds a warning or an error for this.
      // See https://github.com/webpack/webpack/issues/6571
      sideEffects: true,
    };
  }

  public get imageRule(): RuleSetRule {
    return {
      test: /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/,
      type: 'asset',
      generator: {
        filename: `${this.versionPath}static/img/${
          this.isDev ? '[name]' : '[contenthash]'
        }[ext][query]`,
      },
    };
  }

  public get svgRule(): RuleSetRule {
    // do not base64-inline SVGs.
    // https://github.com/facebookincubator/create-react-app/pull/1180
    return {
      test: /\.(svg)(\?.*)?$/,
      oneOf: [
        {
          resourceQuery: /raw/,
          type: 'asset/source',
        },
        {
          type: 'asset/resource',
          generator: {
            filename: `${this.versionPath}static/img/${
              this.isDev ? '[name]' : '[contenthash]'
            }[ext][query]`,
          },
        },
      ],
    };
  }

  public get mediaRule(): RuleSetRule {
    return {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      type: 'asset',
      generator: {
        filename: `${this.versionPath}static/media/${
          this.isDev ? '[name]' : '[contenthash:8]'
        }[ext][query]`,
      },
    };
  }

  public get fontRule(): RuleSetRule {
    return {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
      type: 'asset',
      generator: {
        filename: `${this.versionPath}static/fonts/${
          this.isDev ? '[name]' : '[contenthash:8]'
        }[ext][query]`,
      },
    };
  }

  public get shaderRule(): RuleSetRule {
    return {
      test: /\.(glsl|frag|vert)(\?.*)?$/,
      type: 'asset/source',
      generator: {
        filename: `${this.versionPath}static/shaders/${
          this.isDev ? '[name]' : '[contenthash]'
        }[ext][query]`,
      },
    };
  }

  public get rules() {
    return [
      this.tsRule,
      this.jsRule,

      this.cssRule,
      this.sassRule,

      this.imageRule,
      this.svgRule,
      this.mediaRule,
      this.fontRule,
      this.shaderRule,
    ];
  }

  public get entry() {
    return paths.entry;
  }

  public async final(): Promise<Configuration | ReadonlyArray<Configuration>> {
    let outputPath = this.options.output ?? paths.output;
    outputPath = !isAbsolute(outputPath) ? resolve(outputPath) : outputPath;

    return {
      stats: 'none',
      name: 'pota-webpack',
      target: 'web',
      mode: this.isDev ? 'development' : 'production',
      // will bail compilation on the first error,
      // instead of the default behavior of tolerating the error
      bail: this.isProd,
      devtool: this.options['source-map'],
      context: paths.user,
      entry: this.entry,

      cache: this.options.cache && { type: 'filesystem' },

      output: {
        path: outputPath,
        publicPath: this.options['public-path'],
        filename: `${this.versionPath}static/chunks/[name]${this.isDev ? '' : '.[contenthash]'}.js`,
        chunkFilename: `${this.versionPath}static/chunks/[name]${
          this.isDev ? '' : '.[contenthash]'
        }.js`,
        hotUpdateChunkFilename: `static/webpack/[id].[fullhash].hot-update.js`,
        hotUpdateMainFilename: `static/webpack/[fullhash].[runtime].hot-update.json`,
        globalObject: 'this',
        strictModuleErrorHandling: true,
      },

      resolveLoader: { modules: this.modules },
      resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: this.alias,
        modules: this.modules,
      },

      optimization: {
        minimizer: [
          '...', // This will make sure to include webpack's default minimizer
          new CssMinimizerPlugin(),
        ],
        minimize: this.isProd,
        emitOnErrors: this.isProd,
        moduleIds: this.isProd ? 'deterministic' : 'named',
        splitChunks: this.isProd && {
          cacheGroups: {
            defaultVendors: {
              name: `chunk-vendors`,
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              chunks: 'initial',
            },
            common: {
              name: `chunk-common`,
              minChunks: 2,
              priority: -20,
              chunks: 'initial',
              reuseExistingChunk: true,
            },
          },
          maxInitialRequests: 25,
        },

        // Keep the runtime chunk separated to enable long term caching
        // https://twitter.com/wSokra/status/969679223278505985
        // https://github.com/facebook/create-react-app/issues/5358
        runtimeChunk: {
          name: 'runtime',
        },
      },

      devServer: this.finalDevServer(),

      module: {
        rules: this.rules,
      },
      plugins: await this.plugins(),
    };
  }
}

export default (options: WebpackConfigOptions) => new WebpackConfig(options);

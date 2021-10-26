import { resolve } from "path";

import webpack from "webpack";
import HTMLPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import ErrorPlugin from "friendly-errors-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"

import babelConfig from "./babel.config.js";
import * as paths from "./paths.js";
import getEnv from "./getEnv.js";

const IS_DEV_ENV = process.env.NODE_ENV === "development";
const IS_PROD_ENV = (process.env.NODE_ENV === "production") || !IS_DEV_ENV;

export function parseOptions(options) {
  const {
    mode = IS_PROD_ENV ? "production" : "development",
    analyze = false,
    output = paths.output,
    ['public-url']: publicUrl = "/",
    ['type-check']: typeCheck = true,
    ['source-map']: sourceMap = { "production": 'source-map', 'development': 'eval-source-map' }[mode],
  } = options;

  return {
    mode,
    publicUrl,
    output,
    sourceMap: sourceMap === "false" ? false : sourceMap,
    typeCheck: typeCheck === "false" ? false : typeCheck,
    analyze,
    isDev: mode === "development",
    isProd: mode === "production"
  };
}

export default function createConfig(unsafeOptions = {}) {
  const options = parseOptions(unsafeOptions);
  const env = getEnv();

  function getStyleLoaders(cssOptions, preProcessor) {
    return [
      options.isDev && "style-loader",
      options.isProd && MiniCssExtractPlugin.loader,
      { loader: "css-loader", options: cssOptions },
      {
        loader: "postcss-loader",
        options: {
          postcssOptions: {
            plugins: ["autoprefixer"],
          },
        },
      },
      ...(preProcessor
        ? [
          { loader: "resolve-url-loader" },
          { loader: preProcessor },
        ]
        : []),
    ].filter(Boolean);
  }

  /**
    * @type {import('webpack').Configuration}
    */
  return {
    stats: "none",
    name: "pota-webpack",
    target: "web",
    mode: options.mode,
    // will bail compilation on the first error,
    // instead of the default behavior of tolerating the error
    bail: options.isProd,
    devtool: options.sourceMap,
    context: paths.user,
    entry: paths.entry,

    output: {
      path: options.output,
      publicPath: options.publicUrl,
      filename: `static/chunks/[name]${options.isDev ? "" : ".[contenthash]"}.js`,
      chunkFilename: `static/chunks/[name]${options.isDev ? "" : ".[contenthash]"}.js`,
      hotUpdateChunkFilename: `static/webpack/[id].[fullhash].hot-update.js`,
      hotUpdateMainFilename: `static/webpack/[fullhash].[runtime].hot-update.json`,
      globalObject: "this",
      strictModuleErrorHandling: true
    },

    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      alias: {
        "@": paths.source,
        'mediamonks-webgl': resolve(paths.source, 'src/webgl/lib/'),
      },
    },

    optimization: {
      minimize: options.isProd,
      emitOnErrors: options.isProd,
      moduleIds: options.isProd ? 'deterministic' : 'named',
      splitChunks: options.isProd && {
        cacheGroups: {
          defaultVendors: {
            name: `chunk-vendors`,
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: "initial",
          },
          common: {
            name: `chunk-common`,
            minChunks: 2,
            priority: -20,
            chunks: "initial",
            reuseExistingChunk: true,
          },
        },
        maxInitialRequests: 25
      },

      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      // https://github.com/facebook/create-react-app/issues/5358
      runtimeChunk: {
        name: "runtime",
      },
    },

    devServer: {
      hot: true,
      historyApiFallback: true,
      client: {
        logging: 'none',
        progress: true,
        overlay: false,
      },
    },

    module: {
      rules: [

        /**
         * TYPESCRIPT
         */
        {
          test: /\.tsx?$/,
          include: paths.source,
          use: [
            { loader: "babel-loader", options: babelConfig },
            {
              loader: "ts-loader",
              options: {
                // makes sure to load only the files required by webpack and nothing more
                onlyCompileBundledFiles: true,
                // type checking is handled by `fork-ts-checker-webpack-plugin`
                transpileOnly: true,
                happyPackMode: true,
              },
            },
          ],
        },

        /**
         * JAVASCRIPT
         */
        {
          test: /\.m?jsx?$/,
          include: paths.source,
          use: [{ loader: "babel-loader", options: babelConfig }],
        },

        /**
         * CSS
         */
        // "postcss" loader applies autoprefixer to our CSS.
        // "css" loader resolves paths in CSS and adds assets as dependencies.
        // "style" loader turns CSS into JS modules that inject <style> tags.
        // In production, we use MiniCSSExtractPlugin to extract that CSS
        // to a file, but in development "style" loader enables hot editing
        // of CSS.
        {
          test: /\.css$/,
          use: getStyleLoaders({ importLoaders: 1 }),
          // Don't consider CSS imports dead code even if the
          // containing package claims to have no side effects.
          // Remove this when webpack adds a warning or an error for this.
          // See https://github.com/webpack/webpack/issues/6571
          sideEffects: true,
        },

        // Opt-in support for SASS (using .scss or .sass extensions).
        // By default we support SASS Modules with the
        // extensions .module.scss or .module.sass
        {
          test: /\.(scss|sass)$/,
          use: getStyleLoaders({ importLoaders: 3 }, "sass-loader"),
          // Don't consider CSS imports dead code even if the
          // containing package claims to have no side effects.
          // Remove this when webpack adds a warning or an error for this.
          // See https://github.com/webpack/webpack/issues/6571
          sideEffects: true,
        },

        /**
         * ASSETS
         */

        {
          test: /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/,
          type: "asset",
          generator: { filename: `static/img/${options.isDev ? "[name]" : "[contenthash]"}[ext][query]` },
        },

        // do not base64-inline SVGs.
        // https://github.com/facebookincubator/create-react-app/pull/1180
        {
          test: /\.(svg)(\?.*)?$/,
          type: "asset/resource",
          generator: { filename: `static/img/${options.isDev ? "[name]" : "[contenthash]"}[ext][query]` },
        },

        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          type: "asset",
          generator: { filename: `static/media/${options.isDev ? "[name]" : "[contenthash:8]"}[ext][query]` },
        },

        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
          type: "asset",
          generator: { filename: `static/fonts/${options.isDev ? "[name]" : "[contenthash:8]"}[ext][query]` },
        },

        {
          test: /\.(glsl|frag|vert)(\?.*)?$/,
          type: "asset/source",
          generator: { filename: `static/shaders/${options.isDev ? "[name]" : "[contenthash]"}[ext][query]` },
        },
      ],
    },

    plugins: [
      // new webpack.CleanPlugin({}),
      new HTMLPlugin({
        inject: true,
        favicon: resolve(paths.publicDir, "favicon.ico"),
        template: resolve(paths.publicDir, "index.html"),
      }),
      new ErrorPlugin(),
      new webpack.DefinePlugin(env.stringified),
      options.isProd && new MiniCssExtractPlugin({
        filename: 'static/css/[contenthash].css',
        chunkFilename: 'static/css/[contenthash].css',
      }),
      options.isProd &&
      new CopyPlugin({
        patterns: [
          {
            from: paths.publicDir,
            to: options.output,
            toType: "dir",
            globOptions: { ignore: ["**/.DS_Store", resolve(paths.publicDir, "index.html")] },
          },
        ],
      }),
      options.typeCheck &&
      new ForkTsCheckerWebpackPlugin({
        async: options.isDev,
        typescript: { diagnosticOptions: { semantic: true, syntactic: true } },
      }),
      options.analyze && new BundleAnalyzerPlugin(typeof options.analyze === "string" ? { analyzerMode: options.analyze } : {}),
    ].filter(Boolean),
  }
}

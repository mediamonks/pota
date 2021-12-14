import { resolve } from "path";

import webpack from "webpack";
import HTMLPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import ErrorPlugin from "friendly-errors-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

import babelConfig from "./babel.config.js";
import * as paths from "./paths.js";
import getEnv from "./getEnv.js";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";

const IS_DEV_ENV = process.env.NODE_ENV === "development";
const IS_PROD_ENV = process.env.NODE_ENV === "production" || !IS_DEV_ENV;

export function parseOptions(options) {
  const {
    analyze = false,
    output = paths.output,
    cache = true,
    versioning = false,
    ["image-compression"]: imageCompression = true,
    ["public-path"]: publicPath = "/",
    ["typecheck"]: typeCheck = true,
    ["source-map"]: sourceMap = IS_PROD_ENV ? "source-map" : "eval-source-map",
  } = options;

  return {
    output,
    analyze,
    publicPath,
    versioning,
    imageCompression,
    cache,
    sourceMap,
    typeCheck,
    isDev: IS_DEV_ENV,
    isProd: IS_PROD_ENV,
  };
}

export default function createConfig(unsafeOptions = {}) {
  const options = parseOptions(unsafeOptions);

  const versionPath = options.versioning ? `version/${process.env.VERSION ?? Date.now()}/` : "";

  const env = getEnv({
    PUBLIC_PATH: options.publicPath,
    VERSIONED_STATIC: `${versionPath}static/`,
  });

  function getStyleLoaders(preProcessor) {
    return [
      options.isDev ? "style-loader" : MiniCssExtractPlugin.loader,
      { loader: "css-loader", options: { importLoaders: preProcessor ? 3 : 1 } },
      { loader: "postcss-loader" },
      ...(preProcessor ? [{ loader: "resolve-url-loader" }, { loader: preProcessor }] : []),
    ];
  }

  /**
   * @type {import('webpack').Configuration}
   */
  return {
    stats: "none",
    name: "pota-webpack",
    target: "web",
    mode: options.isDev ? "development" : "production",
    // will bail compilation on the first error,
    // instead of the default behavior of tolerating the error
    bail: options.isProd,
    devtool: options.sourceMap,
    context: paths.user,
    entry: paths.entry,

    cache: options.cache && { type: "filesystem" },

    output: {
      path: options.output,
      publicPath: options.publicPath,
      filename: `${versionPath}static/chunks/[name]${options.isDev ? "" : ".[contenthash]"}.js`,
      chunkFilename: `${versionPath}static/chunks/[name]${
        options.isDev ? "" : ".[contenthash]"
      }.js`,
      hotUpdateChunkFilename: `static/webpack/[id].[fullhash].hot-update.js`,
      hotUpdateMainFilename: `static/webpack/[fullhash].[runtime].hot-update.json`,
      globalObject: "this",
      strictModuleErrorHandling: true,
    },

    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      alias: {
        "@": paths.source,
      },
    },

    optimization: {
      minimizer: [
        "...", // This will make sure to include webpack's default minimizer
        new CssMinimizerPlugin(),
      ],
      minimize: options.isProd,
      emitOnErrors: options.isProd,
      moduleIds: options.isProd ? "deterministic" : "named",
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
        maxInitialRequests: 25,
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
        logging: "none",
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
          use: getStyleLoaders(),
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
          use: getStyleLoaders("sass-loader"),
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
          generator: {
            filename: `${versionPath}static/img/${
              options.isDev ? "[name]" : "[contenthash]"
            }[ext][query]`,
          },
        },

        // do not base64-inline SVGs.
        // https://github.com/facebookincubator/create-react-app/pull/1180
        {
          test: /\.(svg)(\?.*)?$/,
          oneOf: [
            {
              resourceQuery: /raw/,
              type: "asset/source",
            },
            {
              type: "asset/resource",
              generator: {
                filename: `${versionPath}static/img/${
                  options.isDev ? "[name]" : "[contenthash]"
                }[ext][query]`,
              },
            },
          ],
        },

        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          type: "asset",
          generator: {
            filename: `${versionPath}static/media/${
              options.isDev ? "[name]" : "[contenthash:8]"
            }[ext][query]`,
          },
        },

        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
          type: "asset",
          generator: {
            filename: `${versionPath}static/fonts/${
              options.isDev ? "[name]" : "[contenthash:8]"
            }[ext][query]`,
          },
        },

        {
          test: /\.(glsl|frag|vert)(\?.*)?$/,
          type: "asset/source",
          generator: {
            filename: `${versionPath}static/shaders/${
              options.isDev ? "[name]" : "[contenthash]"
            }[ext][query]`,
          },
        },
      ],
    },

    plugins: [
      new HTMLPlugin({
        inject: true,
        favicon: resolve(paths.publicDir, "favicon.ico"),
        template: resolve(paths.publicDir, "index.html"),
      }),
      new ErrorPlugin(),
      new webpack.DefinePlugin(env.stringified),
      new CopyPlugin({
        patterns: [
          {
            from: paths.publicDir,
            toType: "dir",
            globOptions: { ignore: ["**/.*", resolve(paths.publicDir, "index.html")] },
          },
          {
            from: "static",
            to: `${versionPath}static`,
            noErrorOnMissing: true,
            globOptions: { ignore: ["**/.*"] },
          },
        ],
      }),
      options.imageCompression &&
        new ImageMinimizerPlugin({
          minimizerOptions: {
            plugins: [
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              ["svgo"],
            ],
          },
        }),
      options.isProd &&
        new MiniCssExtractPlugin({
          filename: `${versionPath}static/css/[contenthash].css`,
          chunkFilename: `${versionPath}static/css/[contenthash].css`,
        }),
      options.typeCheck &&
        new ForkTsCheckerWebpackPlugin({
          async: options.isDev,
          typescript: { diagnosticOptions: { semantic: true, syntactic: true } },
        }),
      options.analyze &&
        new BundleAnalyzerPlugin(
          typeof options.analyze === "string" ? { analyzerMode: options.analyze } : {}
        ),
    ].filter(Boolean),
  };
}

import { getEnv, DEV_SOURCE_MAP, PROD_SOURCE_MAP, USE_TYPE_CHECK, IS_DEV, IS_PROD } from "./env.js";
import webpack from "webpack";
import { resolve } from "path";
import * as paths from "./paths.js";
import babelConfig from "./babel.config.js";
import HTMLPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import ErrorPlugin from "friendly-errors-webpack-plugin";

const env = getEnv();

/**
 * UTILITIES
 */
function getStyleLoaders(cssOptions, preProcessor) {
  return [
    IS_DEV && "style-loader",
    IS_PROD &&  MiniCssExtractPlugin.loader,
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
export default {
  stats: "none",
  name: "pota-webpack",
  target: "web",
  // if an improper mode or environment is selected,
  // `mode` will be false and webpack will complain about it
  mode: IS_PROD ? "production" : "development",
  // will bail compilation on the first error,
  // instead of the default behavior of tolerating the error
  bail: IS_PROD,
  devtool: IS_PROD ? PROD_SOURCE_MAP : DEV_SOURCE_MAP,
  context: paths.user,
  entry: paths.entry,

  output: {
    path: paths.output,
    filename: `static/chunks/[name]${IS_PROD ? ".[contenthash]": ""}.js`,
    chunkFilename: `static/chunks/[name]${IS_PROD ? ".[contenthash]": ""}.js`,
    hotUpdateChunkFilename: `static/webpack/[id].[fullhash].hot-update.js`,
    hotUpdateMainFilename: `static/webpack/[fullhash].[runtime].hot-update.json`,
    publicPath: env.raw.PUBLIC_URL,
    globalObject: "this",
    strictModuleErrorHandling: true
  },

  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      "@": paths.source
    },
  },

  optimization: {
    minimize: IS_PROD,
    emitOnErrors: IS_PROD,
    moduleIds: IS_PROD ? 'deterministic' : 'named',
    splitChunks: IS_PROD && {
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

  performance: false,

  module: {
    rules: [

      /**
       * TYPESCRIPT
       */
      {
        test: /\.tsx?$/,
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
       * IMAGES
       */
      {
        test: /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/,
        type: "asset",
        generator: { filename: "static/img/[contenthash][ext][query]" },
      },

      // do not base64-inline SVGs.
      // https://github.com/facebookincubator/create-react-app/pull/1180
      {
        test: /\.(svg)(\?.*)?$/,
        type: "asset/resource",
        generator: { filename: "static/img/[contenthash][ext][query]" },
      },

      /**
       * MISC MEDIA
       */
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: "asset",
        generator: { filename: "static/media/[contenthash:8][ext][query]" },
      },

      /**
       * FONTS
       */
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        type: "asset",
        generator: { filename: "static/fonts/[contenthash:8][ext][query]" },
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
    IS_PROD && new MiniCssExtractPlugin({
      filename: 'static/css/[contenthash].css',
      chunkFilename: 'static/css/[contenthash].css',
    }),
    IS_PROD &&
      new CopyPlugin({
        patterns: [
          {
            from: paths.publicDir,
            to: paths.output,
            toType: "dir",
            globOptions: { ignore: ["**/.DS_Store", resolve(paths.publicDir, "index.html")] },
          },
        ],
      }),
    USE_TYPE_CHECK &&
      new ForkTsCheckerWebpackPlugin({
        async: IS_DEV,
        typescript: { diagnosticOptions: { semantic: true, syntactic: true } },
      }),
  ].filter(Boolean),
}

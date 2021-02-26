import getEnv from "./env";
import { Configuration, DefinePlugin, HotModuleReplacementPlugin, RuleSetUse } from "webpack";
import { cwd } from "process";
import { resolve } from "path";
import babelConfig from "./babel.config";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import InlineChunkHtmlPlugin from "react-dev-utils/InlineChunkHtmlPlugin";
import InterpolateHtmlPlugin from "react-dev-utils/InterpolateHtmlPlugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

/**
 * PARSE `process.env`
 */
// Source maps are resource heavy and can cause out of memory issue for large source files.
const USE_SOURCE_MAP = process.env.USE_SOURCE_MAP !== "false";
const CUSTOM_SOURCE_MAP = process.env.CUSTOM_SOURCE_MAP;

// Some apps do not need the benefits of saving a web request, so not inlining the chunk
// makes for a smoother build process.
const USE_INLINE_RUNTIME_CHUNK = process.env.INLINE_RUNTIME_CHUNK !== "false";

const USE_TYPE_CHECK = process.env.TYPE_CHECK !== "false";

const PUBLIC_URL = process.env.PUBLIC_URL || "/";

const IS_DEV = (process.env.WEBPACK_MODE || process.env.NODE_ENV) === "development";
const IS_PROD = (process.env.WEBPACK_MODE || process.env.NODE_ENV) === "production";

const env = getEnv();

/**
 * UTILITIES
 */
export const getStyleLoaders = (cssOptions: Record<any, unknown>, preProcessor?: any): RuleSetUse =>
  [
    IS_DEV && require.resolve("style-loader"),
    IS_PROD && {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: require.resolve("css-loader"),
      options: cssOptions,
    },
    {
      loader: require.resolve("postcss-loader"),
      options: {
        postcssOptions: {
          plugins: ["autoprefixer"],
        },
      },
    },
    ...(preProcessor
      ? [
          { loader: require.resolve("resolve-url-loader") },
          { loader: require.resolve(preProcessor) },
        ]
      : []),
  ].filter(Boolean) as RuleSetUse;

export default {
  // if an improper mode or environment is selected,
  // `mode` will be false and webpack will complain about it
  mode: IS_PROD ? "production" : IS_DEV && "development",
  // will bail compilation on the first error,
  // instead of the default behavior of tolerating the error
  bail: IS_PROD,
  devtool: USE_SOURCE_MAP
    ? CUSTOM_SOURCE_MAP || (IS_PROD ? "source-map" : IS_DEV && "cheap-source-map")
    : false,

  optimization: {
    // Automatically split vendor and commons
    // https://twitter.com/wSokra/status/969633336732905474
    // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
    splitChunks: {
      chunks: "all",
      // TODO:
      name: false,
    },
    // Keep the runtime chunk separated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    // https://github.com/facebook/create-react-app/issues/5358
    runtimeChunk: {
      name: "runtime",
    },
  },

  // TODO:
  // context: process.cwd(),
  entry: "./src/main.ts",
  output: {
    path: resolve(cwd(), "./build"),
    publicPath: PUBLIC_URL,
    globalObject: "this",
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      "@": resolve("src"),
    },
  },
  module: {
    // TODO:
    strictExportPresence: true,
    rules: [
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          /**
           * TYPESCRIPT
           */
          {
            test: /\.tsx?$/,
            use: [
              { loader: require.resolve("babel-loader"), options: babelConfig },
              {
                loader: require.resolve("ts-loader"),
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
            use: [{ loader: require.resolve("babel-loader"), options: babelConfig }],
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
          // TODO: Merge both of the `url-loader` rules
          // once `image/avif` is in the mime-db (and `url-loader` is updated to support it)
          // https://github.com/jshttp/mime-db
          {
            test: [/\.avif$/],
            loader: require.resolve("url-loader"),
            options: {
              mimetype: "image/avif",
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve("url-loader"),
            options: {
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
          {
            test: /\.(png|jpe?g|gif)(\?.*)?$/,
            use: [
              {
                loader: require.resolve("file-loader"),
                options: {
                  limit: 10000,
                  name: "image/[name].[hash:7].[ext]",
                },
              },
            ],
          },
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            loader: require.resolve("file-loader"),
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: "static/media/[name].[hash:8].[ext]",
            },
          },
          /**
           * 🛑 STOP 🛑
           * are you adding a new loader?
           * make sure to add new loader(s) before `file-loader
           */
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: "./public/index.html",
    }),

    // Inlines the webpack runtime script. This script is too small to warrant
    // a network request.
    // https://github.com/facebook/create-react-app/issues/5358
    IS_PROD &&
      USE_INLINE_RUNTIME_CHUNK &&
      new InlineChunkHtmlPlugin(HtmlWebpackPlugin as any, [/runtime-.+[.]js/]),
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
    // It will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.
    new InterpolateHtmlPlugin(HtmlWebpackPlugin as any, env.raw),
    new DefinePlugin(env.stringified),
    IS_DEV && new HotModuleReplacementPlugin(),
    IS_PROD && new MiniCssExtractPlugin(),
    USE_TYPE_CHECK &&
      new ForkTsCheckerWebpackPlugin({
        async: IS_DEV,
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
        },
      }),
  ].filter(Boolean),
} as Configuration;

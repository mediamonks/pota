import webpackConfig from "@mediamonks/porter-webpack-tools/webpack.config";
import babelConfig from "@mediamonks/porter-webpack-tools/babel.config";
import { Configuration, RuleSetUse } from "webpack";
import merge from "webpack-merge";

import { VueLoaderPlugin } from "vue-loader";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const IS_DEV = (process.env.WEBPACK_MODE || process.env.NODE_ENV) === "development";
const IS_PROD = (process.env.WEBPACK_MODE || process.env.NODE_ENV) === "production";

function getStyleLoaders(cssOptions: Record<any, unknown>, preProcessor?: any): RuleSetUse {
  const loaders = [
    IS_DEV && require.resolve("vue-style-loader"),
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
        plugins: () => [require("autoprefixer")],
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push(
      { loader: require.resolve("resolve-url-loader") },
      { loader: require.resolve(preProcessor) }
    );
  }
  return loaders as RuleSetUse;
}

// TODO: because `vue-loader`'s plugin doesn't like the `oneOf` rule syntax
// we have to fallback to the standard rules[]
// moreover, due to needing `vue-style-loader`, we also have to modify the styles
// and finally, the `file-loader` plugin's `exclude` for some reason doesn't work with `.vue` extensions
// so that is omitted

const withLoaderConfig: Configuration = {
  ...webpackConfig,
  module: {
    ...webpackConfig.module,
    noParse: /^(vue|vue-router|vuex)$/,
    rules: [
      {
        test: /\.vue$/,
        loader: require.resolve("vue-loader"),
      },

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
        use: getStyleLoaders({ importLoaders: 3, esModule: false }),
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
        use: getStyleLoaders({ importLoaders: 1 }, "sass-loader"),
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
    ],
  },
};

export default merge(withLoaderConfig, {
  resolve: {
    extensions: [".vue"],
    alias: {
      vue: "@vue/runtime-dom",
    },
  },

  plugins: [new VueLoaderPlugin()],
});

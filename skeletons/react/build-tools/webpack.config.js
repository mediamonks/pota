import webpackConfig from "@pota/webpack-skeleton/build-tools/webpack.config.js";
import { IS_DEV } from "@pota/webpack-skeleton/build-tools/env.js";
import * as paths from "@pota/webpack-skeleton/build-tools/paths.js";
import babelConfig from "./babel.config.js";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";

const config = {
  ...webpackConfig,
  entry: paths.entry.replace(".ts", ".tsx"),
  module: {
    rules: webpackConfig.module.rules.map(rule => ({
      ...rule,
      use: rule.use?.map?.(use => use.loader === 'babel-loader' ? { ...use, options: babelConfig } : use) ?? rule.use
    })),
  },
  plugins: [...webpackConfig.plugins, IS_DEV && new ReactRefreshPlugin({ overlay: false })].filter(Boolean),
};

export default config;

import webpackConfig from "@mediamonks/porter-webpack-tools/webpack.config";
import webBabelConfig from "@mediamonks/porter-webpack-tools/babel.config";
import merge from "webpack-merge";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import type { Plugin } from "webpack";

/**
 * PARSE `process.env`
 */
const IS_DEV = (process.env.WEBPACK_MODE || process.env.NODE_ENV) === "development";
const IS_PROD = (process.env.WEBPACK_MODE || process.env.NODE_ENV) === "production";
const USE_REACT_REFRESH = process.env.REACT_REFRESH !== "false";
const IS_PROFILE = IS_PROD && process.env.PROFILING;

const BABEL_CONFIG = {
  presets: [...webBabelConfig.presets, ["@babel/preset-react", { runtime: "automatic" }]],
  plugins: [
    ["babel-plugin-styled-components"],
    [
      "babel-plugin-named-asset-import",
      { loaderMap: { svg: { ReactComponent: "@svgr/webpack?-svgo,+titleProp,+ref![path]" } } },
    ],
    IS_DEV && USE_REACT_REFRESH && ["react-refresh/babel"],
  ].filter(Boolean),
};

export default merge(webpackConfig, {
  entry: "./src/main.tsx",
  resolve: {
    alias: {
      // Allows for better profiling with ReactDevTools
      ...(IS_PROFILE && {
        "react-dom$": "react-dom/profiling",
        "scheduler/tracing": "scheduler/tracing-profiling",
      }),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          { loader: require.resolve("babel-loader"), options: BABEL_CONFIG },
          {
            loader: require.resolve("ts-loader"),
            options: {
              onlyCompileBundledFiles: true,
              transpileOnly: true,
              happyPackMode: true,
            },
          },
        ],
      },
      {
        test: /\.m?jsx?$/,
        use: [{ loader: require.resolve("babel-loader"), options: BABEL_CONFIG }],
      },
    ],
  },
  plugins: [IS_DEV && USE_REACT_REFRESH && new ReactRefreshWebpackPlugin()].filter(
    Boolean
  ) as Plugin[],
});

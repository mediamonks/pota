import { IS_DEV } from "@pota/webpack-skeleton/build-tools/env.js";
import babelConfig from "@pota/webpack-skeleton/build-tools/babel.config.js";

export default {
  presets: [
    ...babelConfig.presets,
    ["@babel/preset-react"],
  ],
  plugins: [
    ["babel-plugin-styled-components"],
    [
      "babel-plugin-named-asset-import",
      { loaderMap: { svg: { ReactComponent: "@svgr/webpack?-svgo,+titleProp,+ref![path]" } } },
    ],
    IS_DEV && ["react-refresh/babel"]
  ].filter(Boolean)
};


import babelConfig from "@pota/webpack-skeleton/pota/webpack/babel.config.js";

export default function getBabelConfig(isDev) {
  return {
    presets: [...babelConfig.presets, ["@babel/preset-react"]],
    plugins: [
      ["babel-plugin-styled-components"],
      [
        "babel-plugin-named-asset-import",
        { loaderMap: { svg: { ReactComponent: "@svgr/webpack?-svgo,+titleProp,+ref![path]" } } },
      ],
      isDev && ["react-refresh/babel"],
    ].filter(Boolean),
  };
}

import webpackConfig from "@pota/webpack-skeleton/build-tools/webpack.config.js";
import { VueLoaderPlugin } from "vue-loader";


const config = {
  ...webpackConfig,
  module: {
    ...webpackConfig.module,
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      ...webpackConfig.module.rules
    ],
  },
  resolve: {
...webpackConfig.resolve,
    extensions: [...webpackConfig.resolve.extensions, ".vue"],
  },
  plugins: [...webpackConfig.plugins, new VueLoaderPlugin()],
};

export default config;

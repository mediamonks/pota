import webpackConfig from "@mediamonks/porter-webpack-tools/webpack.config";
import merge from "webpack-merge";

import { VueLoaderPlugin } from "vue-loader";

export default merge(webpackConfig, {
  resolve: { extensions: [".vue"] },
  module: {
    noParse: /^(vue|vue-router|vuex)$/,
    rules: [
      {
        test: /\.vue$/,
        loader: require.resolve("vue-loader"),
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
});

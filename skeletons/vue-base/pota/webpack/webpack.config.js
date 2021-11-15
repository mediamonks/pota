import webpack from "webpack";
import { VueLoaderPlugin } from "vue-loader";

function parseOptions(options) {
  let {
    ['vue-options-api']: optionsApi = false,
    ['vue-prod-devtools']: prodDevTools = false,
  } = options;

  if (optionsApi === "false") optionsApi = false;
  if (prodDevTools === "false") prodDevTools = false;

  return { optionsApi, prodDevTools };
}

export default function createConfig(config, options) {
  const { optionsApi, prodDevTools } = parseOptions(options);

  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        {
          test: /\.vue$/,
          loader: "vue-loader",
        },
        ...config.module.rules,
      ],
    },
    resolve: {
      ...config.resolve,
      extensions: [...config.resolve.extensions, ".vue"],
    },
    plugins: [
      ...config.plugins,
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: optionsApi,
        __VUE_PROD_DEVTOOLS__: prodDevTools
      }),
      new VueLoaderPlugin()],
  };
}

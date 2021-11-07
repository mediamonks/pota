import { VueLoaderPlugin } from "vue-loader";

export default function createConfig(config) {
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
    plugins: [...config.plugins, new VueLoaderPlugin()],
  };
}

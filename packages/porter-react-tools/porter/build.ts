export * from "@mediamonks/porter-webpack-tools/porter/build";

import { builder as webpackBuilder } from "@mediamonks/porter-webpack-tools/porter/build";

// will override the `builder` exported from `porter-webpack-tools`
export const builder = {
  ...webpackBuilder,
  config: { default: require.resolve("../webpack.config.ts") },
};

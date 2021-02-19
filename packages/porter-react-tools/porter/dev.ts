export * from "@mediamonks/porter-webpack-tools/porter/dev";
import { builder as webpackBuilder } from "@mediamonks/porter-webpack-tools/porter/dev";

// will override the `builder` exported from `porter-webpack-tools`
export const builder = {
  ...webpackBuilder,
  config: { default: require.resolve("../webpack.config.ts") },
};

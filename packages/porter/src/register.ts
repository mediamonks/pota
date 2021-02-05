import type { CreateOptions } from "ts-node";

const OPTIONS: CreateOptions = {
  transpileOnly: true,
  files: true, // this will make `ts-node` recognize the `include` and `exclude` fields from `tsconfig`
  ignore: [], // since we're have custom `include` and `exclude` fields setup, we don't want to ignore anything
  project: require.resolve(`../tsconfig.tools.json`), // each `tools` package will be using this same `tsconfig`
};

require("ts-node").register(OPTIONS);

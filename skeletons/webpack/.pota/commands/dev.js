import webpack from "webpack";
import Server from "webpack-dev-server";
import logSymbols from "log-symbols";

import { PROJECT_SKELETON } from "@pota/cli/authoring";

import { createConfig, getNestedConfigs } from "../webpack/util.js";

export const description = "Start the development server using webpack.";

export const options = [
  {
    option: "--cache",
    description: "Cache the build output to improve build speed",
    default: true,
  },
  {
    option: "--https",
    description: `Enables the server's listening socket for TLS (by default, dev server will be served over HTTP)`,
    default: false,
  },
  {
    option: "--prod",
    description: "Sets the NODE_ENV to 'production'.",
  },
  {
    option: "--source-map",
    description: "The source map type (https://webpack.js.org/configuration/devtool/#devtool)",
  },
  {
    option: "--typecheck",
    description: "When disabled, will not do any type checking and ignore TypeScript errors",
    default: true,
  },
];

export const action = async (options) => {
  process.env.NODE_ENV = options.prod ? "production" : "development";

  const modules = await getNestedConfigs();

  const skeleton = modules[modules.length - 1]?.skeleton;

  console.log(logSymbols.info, `Using ${skeleton === PROJECT_SKELETON ? "local" : skeleton } configuration`);

  const config = await createConfig(modules, options);

  const { devServer } = Array.isArray(config) ? config[0] : config;

  await new Server({ ...devServer, https: options.https }, webpack(config)).start();
};

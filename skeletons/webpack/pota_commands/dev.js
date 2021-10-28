import webpack from "webpack";
import Server from "webpack-dev-server";

import getConfig from "../build-tools/getConfig.js";

export const description = "Start the development server using webpack.";

export const options = [
  {
    option: "--https",
    description: `Enables the server's listening socket for TLS (by default, dev server will be served over HTTP)`,
    default: false,
  },
  {
    option: "--mode",
    description: "The webpack mode",
  },
  {
    option: "--source-map",
    description: "The source map type (https://webpack.js.org/configuration/devtool/#devtool)",
  },
  {
    option: "--type-check",
    description: "When disabled, will not do any type checking and ignore TypeScript errors",
    default: true,
  },
];

export const action = async (options) => {
  process.env.NODE_ENV = "development";

  const createConfig = await getConfig();
  const config = await createConfig(options);
  await new Server({ ...config.devServer, https: options.https }, webpack(config)).start();
};

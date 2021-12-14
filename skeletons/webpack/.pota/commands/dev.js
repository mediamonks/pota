import webpack from "webpack";
import Server from "webpack-dev-server";
import logSymbols from "log-symbols";
import getPort, { portNumbers } from "get-port";
import { resolve } from "path";

import kleur from "kleur";

const { green, cyan, red } = kleur;

import { PROJECT_SKELETON } from "@pota/cli/authoring";

import * as paths from "../webpack/paths.js";
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
    option: "--open",
    description:
      "Allows to configure dev server to open the browser after the server has been started.",
    default: true,
  },
  {
    option: "--port",
    description: "Allows configuring the port.",
    default: 2001,
  },
  {
    option: "--prod",
    description: "Sets the NODE_ENV to 'production'.",
  },
  {
    option: "--source-map",
    description:
      "The source map type (https://webpack.js.org/configuration/devtool/#devtool)",
  },
  {
    option: "--typecheck",
    description:
      "When disabled, will not do any type checking and ignore TypeScript errors",
    default: true,
  },
];

export const action = async (options) => {
  process.env.NODE_ENV = options.prod ? "production" : "development";

  const modules = await getNestedConfigs();

  const skeleton = modules[modules.length - 1]?.skeleton;

  console.log(
    logSymbols.info,
    `Using ${cyan(
      skeleton === PROJECT_SKELETON ? "local" : skeleton
    )} configuration`
  );

  if (typeof options.port === "number") {
    const availablePort = await getPort({
      port: portNumbers(options.port, options.port + 100),
    });

    if (availablePort !== options.port) {
      console.log(
        logSymbols.warning,
        `Port ${red(options.port)} is unavailable, using ${green(
          availablePort
        )} as a fallback.`
      );

      options.port = availablePort;
    }
  }

  console.log(); // spacing

  const config = await createConfig(modules, options);

  const { devServer } = Array.isArray(config) ? config[0] : config;

  const proxySetup = await loadProxySetup();

  await new Server(
    {
      ...devServer,
      https: options.https,
      open: options.open,
      port: options.port,
      ...(proxySetup && {
        onBeforeSetupMiddleware(devServer) {
          proxySetup(devServer.app);
        },
      }),
    },
    webpack(config)
  ).start();
};

async function loadProxySetup() {
  try {
    const setup = (await import(resolve(paths.user, "setupProxy.js"))).default;

    if (typeof setup !== "function") {
      throw new Error("`setupProxy.js` should export default a function.");
    }

    return setup;
  } catch (error) {
    if (error.code !== "ERR_MODULE_NOT_FOUND") {
      console.warn(error);
    }

    return null;
  }
}

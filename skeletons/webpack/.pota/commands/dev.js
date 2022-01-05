import { resolve } from "path";

import webpack from "webpack";
import Server from "webpack-dev-server";
import logSymbols from "log-symbols";
import getPort, { portNumbers } from "get-port";

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

  const port = await parsePort(options);

  console.log(
    logSymbols.info,
    `Using ${cyan(skeleton === PROJECT_SKELETON ? "local" : skeleton)} configuration`
  );

  if (port !== options.port) {
    console.log(
      logSymbols.warning,
      `Port ${red(options.port)} is unavailable, using ${green(port)} as a fallback.`
    );
  }

  console.log(); // spacing

  const config = await createConfig(modules, options);

  const proxySetup = await loadProxySetup();

  const finalDevServerConfig = {
    ...getDevServerConfig(config),
    port,
    https: options.https,
    open: options.open,
    ...(proxySetup && {
      setupMiddlewares(middlewares, devServer) {
        if (!devServer) throw new Error("webpack-dev-server is not defined");

        middlewares.push(proxySetup(devServer.app));

        return middlewares;
      },
    }),
  };

  const compiler = await createCompiler(config);

  if (!compiler) return;

  const server = new Server(finalDevServerConfig, compiler);

  console.log(cyan("Starting the development server..."));
  console.log(); // spacing

  await server.start();
};

async function parsePort(options) {
  if (!typeof options.port === "number") return undefined;

  return getPort({ port: portNumbers(options.port, options.port + 100) });
}

function getDevServerConfig(config) {
  return (Array.isArray(config) ? config : [config]).find(({ devServer }) => devServer).devServer;
}

async function loadProxySetup() {
  try {
    const setup = (await import(resolve(paths.user, "setupProxy.js"))).default;

    if (typeof setup !== "function") {
      throw new Error("`setupProxy.js` should export default a function.");
    }

    return setup;
  } catch (error) {
    if (error.code !== "ERR_MODULE_NOT_FOUND") console.warn(error);

    return null;
  }
}

async function createCompiler(config) {
  try {
    return webpack(config);
  } catch (error) {
    console.error(red("Failed to initialize compiler."));
    console.log();
    console.error(error.message || error);
    console.log();
    return null;
  }
}

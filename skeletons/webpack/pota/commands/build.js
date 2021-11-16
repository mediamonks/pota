import { relative, isAbsolute, resolve } from "path";

import { getNestedFiles, PROJECT_SKELETON } from "@pota/cli/authoring";
import webpack from "webpack";
import logSymbols from "log-symbols";

import * as paths from "../webpack/paths.js";

export const description = "Build the source directory using webpack.";

export const options = [
  {
    option: "--public-url",
    description: `The URL from which static assets are referenced from`,
    default: "/",
  },
  {
    option: "--output",
    description: "The output directory",
    default: relative(paths.user, paths.output),
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
    option: "--analyze",
    description: "Build and then analyze the build output",
  },
  {
    option: "--type-check",
    description: "When disabled, will not do any type checking and ignore TypeScript errors",
    default: true,
  },
  {
    option: "--cache",
    description: "Cache the build output to improve build speed",
    default: true,
  },
  {
    option: "--versioning",
    description: "Enable static resource versioning",
    default: false,
  }
];

export const action = async (options) => {
  process.env.NODE_ENV = "production";

  const modules = await getNestedConfigModulesSelf();

  const skeleton = modules[modules.length - 1]?.skeleton;

  console.log(logSymbols.info, `Using ${skeleton === PROJECT_SKELETON ? "local" : skeleton } configuration`);

  const config = await createConfig(modules, preprocessOptions(options));

  console.log("Building...");

  try {
    const stats = await new Promise(async (resolve, reject) =>
      webpack(config, (error, stats) => {
        if (!error && stats?.hasErrors()) error = stats.toJson({ colors: true })?.errors;

        return error ? reject(error) : resolve(stats?.toString({ colors: true, chunks: false }));
      })
    );

    console.log(stats);
    console.log();
    console.log(logSymbols.success, "Building Finished 🎉");
  } catch (error) {
    console.log(logSymbols.error, "Building Failed 😟");
    console.log();
    console.error(error);
  }
};

function preprocessOptions(options) {
  if ("output" in options && !isAbsolute(options.output)) {
    return { ...options, output: resolve(options.output) };
  }

  return options;
}

function isFunction(value) {
  return typeof value === "function";
}

export async function getNestedConfigModulesSelf() {
  const files = await getNestedFiles("pota/webpack/webpack.config.js");
  const modules = files.map(async ({ file, skeleton }) => {
    try {
      const module = (await import(file)).default;

      if (isFunction(module)) return { module, skeleton };

      // TODO: handle skeleton module errors
    } catch (error) { }

    return null;
  });

  return (await Promise.all(modules)).filter(Boolean);
}

export async function createConfig(modules, options) {
  let config = null;

  for (const { module } of modules) {
    if (config === null) config = await module(options);
    else config = await module(config, options);
  }

  return config;
}

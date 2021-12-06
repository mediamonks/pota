import { relative, isAbsolute, resolve } from "path";

import { PROJECT_SKELETON } from "@pota/cli/authoring";
import webpack from "webpack";
import logSymbols from "log-symbols";

import * as paths from "../webpack/paths.js";
import { createConfig, getNestedConfigs } from "../webpack/util.js";

export const description = "Build the source directory using webpack.";

export const options = [
  {
    option: "--analyze",
    description: "When enabled, will open a bundle report after bundling.",
  },
  {
    option: "--cache",
    description:
      "Toggles webpack's caching behavior. (https://webpack.js.org/configuration/cache/)",
    default: true,
  },
  {
    option: "--debug",
    description: "Sets NODE_ENV to 'development'.",
  },
  {
    option: "--output",
    description: "The build output directory.",
    default: relative(paths.user, paths.output),
  },
  {
    option: "--source-map",
    description:
      "Sets the style of source-map, for enhanced debugging. Disable or use faster options in you are having out of memory or other performance issues. (https://webpack.js.org/configuration/devtool/#devtool)",
  },
  {
    option: "--public-path",
    description: "The location of static assets on your production server.",
    default: "/",
  },
  {
    option: "--type-check",
    description: "When disabled, will ignore type related errors.",
    default: true,
  },

  {
    option: "--versioning",
    description:
      "When enabled, will copy assets in ./static to a versioned directory in the output (e.g. build/version/v2/static/...).",
    default: false,
  },
];

export const action = async (options) => {
  process.env.NODE_ENV = options.debug ? "development" : "production";

  const modules = await getNestedConfigs();

  const skeleton = modules[modules.length - 1]?.skeleton;

  console.log(
    logSymbols.info,
    `Using ${skeleton === PROJECT_SKELETON ? "local" : skeleton} configuration`
  );

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


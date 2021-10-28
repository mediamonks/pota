import { relative, isAbsolute, resolve } from "path";

import webpack from "webpack";
import ora from "ora";

import * as paths from "../build-tools/paths.js";
import getConfig, { getSkeleton } from "../build-tools/getConfig.js";

export const description = "Build the source directory using webpack.";

export const options = [
  {
    option: '--public-url',
    description: `The URL from which static assets are referenced from`,
    default: '/'
  },
  {
    option: '--output',
    description: 'The output directory',
    default: relative(paths.user, paths.output)
  },
  {
    option: '--mode',
    description: 'The webpack mode',
  },
  {
    option: '--source-map',
    description: 'The source map type (https://webpack.js.org/configuration/devtool/#devtool)',
  },
  {
    option: '--analyze',
    description: 'Build and then analyze the build output',
  },
  {
    option: '--type-check',
    description: 'When disabled, will not do any type checking and ignore TypeScript errors',
    default: true
  }
];

function preprocessOptions(options) {
  if ("output" in options && !isAbsolute(options.output)) {
    return { ...options, output: resolve(options.output) }
  }

  return options;
}

export const action = async (options) => {
  process.env.NODE_ENV = "production";

  const SPINNER = ora(`Reading configuration of '${getSkeleton()}'`).start();

  const config = await getConfig();

  SPINNER.succeed().start("Building...");

  options = preprocessOptions(options);

  try {
    const stats = await new Promise((resolve, reject) =>
      webpack(await config(options), (error, stats) => {
        if (!error && stats?.hasErrors()) error = stats.toJson({ colors: true })?.errors;

        return error ? reject(error) : resolve(stats?.toString({ colors: true, chunks: false }));
      })
    );

    console.log(stats);
    console.log();
    SPINNER.succeed("Building Finished 🎉");
  } catch (error) {
    SPINNER.fail("Building Failed 😟")
    console.log();
    console.error(error);
  }
}

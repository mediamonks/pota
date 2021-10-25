import { relative, isAbsolute, resolve } from "path";

import webpack from "webpack";
import ora from "ora";

import * as paths from "../build-tools/paths.js";
import getConfig, { getSkeleton } from "../build-tools/getConfig.js";

export const description = "Build the source directory using webpack.";

export const options = [
  {
    option: '--publicUrl',
    description: 'The public url',
  },
  {
    option: '--outputDir',
    description: 'The output directory',
    default: relative(paths.user, paths.output)
  },
  {
    option: '--mode',
    description: 'The webpack mode',
  }
];

function preprocessOptions(options) {
  if ("outputDir" in options && !isAbsolute(options.outputDir)) {
    return { ...options, outputDir: resolve(options.outputDir) }
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
      webpack(config(options), (error, stats) => {
        if (!error && stats?.hasErrors()) error = stats.toJson()?.errors;

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

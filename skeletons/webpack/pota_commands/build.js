import webpack from "webpack";
import ora from "ora";
import getConfig, { getSkeleton } from "../build-tools/getConfig.js";

export const description = "Build the source directory using webpack.";

export const action = async () => {
  process.env.NODE_ENV = "production";

  const SPINNER = ora(`Reading configuration of '${getSkeleton()}'`).start();

  const config = await getConfig();

  SPINNER.succeed().start("Building...");

  try {
    const stats = await new Promise((resolve, reject) =>
      webpack(config, (error, stats) => {
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

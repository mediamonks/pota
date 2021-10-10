import webpack from "webpack";
import ora from "ora";
import { join } from "path";
import { fileURLToPath } from "url";

function getNodeModulesPath() {
  const currentPath = fileURLToPath(import.meta.url)

  const modulesDir = "node_modules";

  return currentPath.substring(0, currentPath.indexOf(modulesDir) + modulesDir.length);
}

function getConfigPathForSkeleton(skeleton) {
  return join(getNodeModulesPath(), skeleton, "build-tools", "webpack.config.js");
}

export function command(program) {
  program
    .command('build')
    .describe('Build the source directory using webpack.')
    .action(async () => {
      const skeleton = process.env.POTA_SKELETON || "@pota/webpack-skeleton";

      const configPath = getConfigPathForSkeleton(skeleton);

      process.env.NODE_ENV = "production";

      const SPINNER = ora(`Reading configuration of '${skeleton}'`).start();

      const config = await import(configPath).then(({ default: m }) => m);

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
    });
}


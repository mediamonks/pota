import * as fs from "fs";
import * as path from "path";
import webpack from "webpack";
import devServer from "./devServer";

const appDirectory = fs.realpathSync(process.cwd());
/**
 * will resolve the path relative to the user
 * @param relativePath - path relative to the user
 */
const resolveUser = (relativePath: string) => path.resolve(appDirectory, relativePath);

async function importWebpackConfig(fallbackPorterDependency: string) {
  return import(resolveUser("./webpack.config.ts"))
    .catch((e) => {
      console.log("DEBUG:", `Could not find local 'webpack.config.ts'`);

      return import(`${fallbackPorterDependency}/webpack.config.ts`).catch((e) => {
        console.log(
          "DEBUG:",
          `Could not find 'webpack.config.ts' of '${fallbackPorterDependency}'`
        );
        return { default: {} };
      });
    })
    .then(({ default: d }) => d);
}

export async function decorate(command: "dev" | "build", { name }: { name: string }) {
  switch (command) {
    case "dev": {
      process.env.WEBPACK_MODE ??= "development";

      const config = await importWebpackConfig(name);

      devServer(webpack(config));
      break;
    }
    case "build": {
      process.env.WEBPACK_MODE ??= "production";

      const config = await importWebpackConfig(name);

      try {
        await new Promise<string | undefined>((resolve, reject) =>
          webpack(config, (error, stats) => {
            error = error ?? (stats?.hasErrors() && stats.toJson()?.errors);

            return error ? reject(error) : resolve(stats?.toString());
          })
        );

        console.log(`Finished bundling`);
      } catch (error) {
        console.error(`Bundling failed`);
        console.error(error);
      }

      break;
    }
  }
}

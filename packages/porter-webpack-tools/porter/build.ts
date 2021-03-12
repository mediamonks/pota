import webpack from "webpack";
import { Arguments } from "../helpers";

export const command = "build";

export const describe = "Bundle the project using webpack";

export const builder = {
  config: { default: require.resolve("../webpack.config.ts") },
};

export async function handler({ config: configPath }: Arguments<typeof builder>) {
  process.env.WEBPACK_MODE ??= "production";

  const config = (await import(configPath))?.default;

  await new Promise<void>(async (resolve, reject) =>
    webpack(config, (error, stats) => {
      if (error) {
        return reject(error);
      }

      if (stats?.hasErrors()) {
        return reject(new Error("Build failed with errors."));
      }

      resolve();
    })
  );

  console.log(`Finished bundling`);
}

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

  try {
    await new Promise<string | undefined>(async (resolve, reject) =>
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
}

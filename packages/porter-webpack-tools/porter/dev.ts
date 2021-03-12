import webpack from "webpack";
import Server from "webpack-dev-server";
import kleur from "kleur";
import * as path from "path";
import * as paths from "../paths";
import getEnv from "../env";
import { choosePort } from "react-dev-utils/WebpackDevServerUtils";
import { Arguments } from "../helpers";

export const command = "dev";

export const describe = "Start the development server";

const env = getEnv();

export const builder = {
  config: { default: paths.config },
  port: { default: (process.env.PORT && parseInt(process.env.PORT, 10)) || 8888 },
  host: { default: process.env.HOST || "0.0.0.0" },
};

export async function handler({ config: configPath, port, host }: Arguments<typeof builder>) {
  process.env.WEBPACK_MODE ??= "development";

  const config = (await import(configPath))?.default;

  const server = new Server(webpack(config), {
    hot: true,
    stats: "minimal",
    historyApiFallback: true,
    disableHostCheck: true,
    publicPath: env.raw.PUBLIC_URL,
    contentBase: path.relative(paths.user, paths.publicDir),
  });

  port = (await choosePort(host, port)) || port;

  server.listen(port, host, (error) => {
    if (error) {
      throw error;
    }
    console.log(kleur.cyan("Starting the development server...\n"));
  });

  function closeProcess() {
    server.close();
    process.exit();
  }

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, closeProcess);
  }

  return server;
}

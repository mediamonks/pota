import webpack from "webpack";
import Server from "webpack-dev-server";
import kleur from "kleur";
import { choosePort } from "react-dev-utils/WebpackDevServerUtils";
import { Arguments } from "../helpers";

export const command = "dev";

export const describe = "Start the development server";

export const builder = {
  config: { default: require.resolve("../webpack.config.ts") },
  port: { default: (process.env.PORT && parseInt(process.env.PORT, 10)) || 8888 },
  host: { default: process.env.HOST || "0.0.0.0" },
};

export async function handler({ config: configPath, port, host }: Arguments<typeof builder>) {
  process.env.WEBPACK_MODE ??= "development";

  const config = (await import(configPath))?.default;

  port = (await choosePort(host, port)) || port;

  const server = new Server(webpack(config), {
    hot: true,
    contentBase: "./public",
    contentBasePublicPath: process.env.PUBLIC_PATH,
  });

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

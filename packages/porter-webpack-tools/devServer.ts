import { Compiler } from "webpack";
import Server from "webpack-dev-server";
import kleur from "kleur";
import { choosePort } from "react-dev-utils/WebpackDevServerUtils";

const DEFAULT_PORT = (process.env.PORT && parseInt(process.env.PORT, 10)) || 8888;
const HOST = process.env.HOST || "0.0.0.0";

export default async function start(compiler: Compiler) {
  const port = (await choosePort(HOST, DEFAULT_PORT)) || DEFAULT_PORT;

  const server = new Server(compiler, {
    hot: true,
    contentBase: "./public",
    contentBasePublicPath: process.env.PUBLIC_PATH,
  });

  server.listen(port, HOST, (error) => {
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

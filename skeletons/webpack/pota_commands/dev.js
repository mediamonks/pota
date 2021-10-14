import webpack from "webpack";
import Server from "webpack-dev-server";
import getConfig from "../build-tools/getConfig.js";

export const description = "Start the development server using webpack.";

export const action = async () => {
  process.env.NODE_ENV = "development";

  const config = await getConfig();
  await new Server(config.devServer, webpack(config)).start();
};




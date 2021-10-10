import webpack from "webpack";
import Server from "webpack-dev-server";
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
    .command('dev')
    .describe('Start the development server using webpack.')
    .action(async () => {
      const skeleton = process.env.POTA_SKELETON || "@pota/webpack-skeleton";
      const configPath = getConfigPathForSkeleton(skeleton);

      process.env.NODE_ENV = "development";

      const config = await import(configPath).then(({ default: m }) => m);
      await new Server(config.devServer, webpack(config)).start();
    });
}



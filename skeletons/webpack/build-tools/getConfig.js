import { resolve } from "path";
import { fileURLToPath } from "url";

export function getSkeleton() {
  return process.env.POTA_SKELETON || "@pota/webpack-skeleton";
}

function getNodeModulesPath() {
  const currentPath = fileURLToPath(import.meta.url)

  const modulesDir = "node_modules";

  return currentPath.substring(0, currentPath.indexOf(modulesDir) + modulesDir.length);
}

function getConfigPath(...paths) {
  return resolve(...paths, "build-tools", "webpack.config.js");
}

export default async function getConfig() {
  // attempt to load the user defined config first
  try {
    return (await import(getConfigPath())).default;
  } catch (error) {
    // TODO: how to show this error with
  }

  // fallback to the skeleton config
  return (await import(getConfigPath(getNodeModulesPath(), getSkeleton()))).default;
}

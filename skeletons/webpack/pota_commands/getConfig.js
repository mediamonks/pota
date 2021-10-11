import { join } from "path";
import { fileURLToPath } from "url";

export function getSkeleton() {
  return process.env.POTA_SKELETON || "@pota/webpack-skeleton";
}

function getNodeModulesPath() {
  const currentPath = fileURLToPath(import.meta.url)

  const modulesDir = "node_modules";

  return currentPath.substring(0, currentPath.indexOf(modulesDir) + modulesDir.length);
}

function getConfigPath() {
  return join(getNodeModulesPath(), getSkeleton(), "build-tools", "webpack.config.js");
}

export default function getConfig() {
  return import(getConfigPath()).then(({ default: m }) => m);
}

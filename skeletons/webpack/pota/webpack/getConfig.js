import { resolve } from "path";
import { fileURLToPath } from "url";

export function getSkeleton() {
  return process.env.POTA_SKELETON || "@pota/webpack-skeleton";
}

function getNodeModulesPath() {
  const currentPath = fileURLToPath(import.meta.url);

  const modulesDir = "node_modules";

  return currentPath.substring(0, currentPath.indexOf(modulesDir) + modulesDir.length);
}

function getConfigPath(...paths) {
  return resolve(...paths, "pota", 'webpack', "webpack.config.js");
}

function loadConfig(path) {
  if (path) return (await import(path)).default;

  return (await import(getConfigPath(getNodeModulesPath(), getSkeleton()))).default;
}

export default async function getConfig(options) {
  const config = await loadConfig(options.path);

  return config = typeof config === "function" ? config(options) : config;
}

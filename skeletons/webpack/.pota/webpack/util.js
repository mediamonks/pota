import { pathToFileURL } from "url";

import { getNestedFiles } from "@pota/cli/authoring";

export function createFindPlugin({ plugins }) {
  return (name) => plugins.find((plugin) => plugin.constructor.name === name);
}

function isFunction(value) {
  return typeof value === "function";
}

export async function getNestedConfigs() {
  const files = await getNestedFiles(".pota/webpack/webpack.config.js");
  const modules = files.map(async ({ file, skeleton }) => {
    try {
      const module = (await import(pathToFileURL(file).toString())).default;

      if (isFunction(module)) return { module, skeleton };

      // TODO: handle skeleton module errors
    } catch (error) {
      console.warn(`Error occured importing '${file}':`)
      console.warn(error);
    }

    return null;
  });

  return (await Promise.all(modules)).filter(Boolean);
}

export async function createConfig(modules, options = {}) {
  let config = null;

  for (const { module } of modules) {
    if (config === null) config = await module(options);
    else config = await module(config, options);
  }

  return config;
}

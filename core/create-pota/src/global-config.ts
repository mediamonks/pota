import { access, readFile, writeFile, mkdir } from 'fs/promises';
import { resolve } from 'path';

import envPaths from 'env-paths';

const CONFIG_DIR_PATH = envPaths('pota').config;
const CONFIG_PATH = resolve(CONFIG_DIR_PATH, 'config.json');

type GlobalConfig = {
  custom: {
    templates: Array<string>;
    scripts: Array<string>;
  };
};

export async function getGlobalConfig(): Promise<GlobalConfig> {
  try {
    await access(CONFIG_PATH);
    return JSON.parse(await readFile(CONFIG_PATH, { encoding: 'utf8' })) as GlobalConfig;
  } catch {
    return {
      custom: {
        templates: [],
        scripts: [],
      },
    };
  }
}

export async function setGlobalConfig(config: GlobalConfig): Promise<void> {
  try {
    await access(CONFIG_DIR_PATH);
  } catch {
    await mkdir(CONFIG_DIR_PATH, { recursive: true });
  }

  await writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
}

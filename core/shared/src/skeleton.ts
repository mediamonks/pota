import { join } from 'path';
import { pathToFileURL } from 'url';
import type { PotaConfig } from './config.js';
import { EXCLUDED_FILES, POTA_DIR, POTA_CONFIG_FILE } from './config.js';
import { Recursive } from './fs.js';

export const getPotaConfigPath = (rootPath: string) =>
  pathToFileURL(join(rootPath, POTA_DIR, POTA_CONFIG_FILE)).toString();

export async function getPotaConfig(rootPath: string): Promise<PotaConfig> {
  return (await import(getPotaConfigPath(rootPath))).default;
}

export async function getSkeletonFromPath(path: string) {
  return (await getPotaConfig(path)).extends;
}

interface SkeletonEntry {
  config: PotaConfig;
  skeleton: string;
  path: string;
  files: ReadonlyArray<string>;
}

export async function getNestedSkeletons(
  path: string,
  rootSkeleton: string,
  dir: string = '',
): Promise<ReadonlyArray<SkeletonEntry>> {
  const skeletons: Array<SkeletonEntry> = [];

  const modulesPath = join(path, 'node_modules');

  let currentSkeleton: string | undefined = rootSkeleton;
  let currentPath: string;

  do {
    currentPath = join(modulesPath, currentSkeleton);
    const config = await getPotaConfig(currentPath);

    if (config) {
      // recursively read all of the files in the skeleton
      let files: ReadonlyArray<string> = [];

      try {
        files = await Recursive.readdir(join(currentPath, dir), { omit: EXCLUDED_FILES });
      } catch {
        // TODO: add debug logging
      }

      // store the skeletons in reverse order
      skeletons.unshift({
        config,
        files,
        path: currentPath,
        skeleton: currentSkeleton,
      });
    }

    currentSkeleton = config?.extends;
  } while (currentSkeleton);

  return skeletons;
}

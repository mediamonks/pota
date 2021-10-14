import { join } from "path";
import type {
  PotaConfig,
  PackageJsonShape,
  SkeletonPotaConfig
} from "./config.js";
import { Recursive, readPackageJson } from "./fs.js";

interface GetNestedSkeletonsOptions {
  enableExcludedFiles?: boolean;
  readDir?: string;
}

interface SkeletonEntry {
  config: PotaConfig;
  skeleton: string;
  path: string;
  files: ReadonlyArray<string>;
}

const EXCLUDED_FILES = [
  "package-lock.json",
  "node_modules"
]

export async function getNestedSkeletons(cwd: string, skeleton: string, options: GetNestedSkeletonsOptions = {}) {
  const { enableExcludedFiles = true, readDir = "" } = options;

  const skeletons: Array<SkeletonEntry> = [];
  const modulesPath = join(cwd, "node_modules");

  let currentSkeleton: string | undefined = skeleton;
  let currentPath: string;
  let currentPackageJson: PackageJsonShape<SkeletonPotaConfig>;

  do {
    currentPath = join(modulesPath, currentSkeleton);
    currentPackageJson = await readPackageJson<SkeletonPotaConfig>(currentPath);

    const config = currentPackageJson.pota;

    if (config) {
      // recursively read all of the files in the skeleton
      let files: ReadonlyArray<string> = [];

      try {
        const omit = [...(config.excludedFiles ?? []), ...EXCLUDED_FILES];
        files = await Recursive.readdir(join(currentPath, readDir), enableExcludedFiles ? { omit } : undefined);
      } catch {
        // TODO: add debug logging
      }

      // store the skeletons in reverse order
      skeletons.unshift({ config, files, path: currentPath, skeleton: currentSkeleton })
    }

    currentSkeleton = config?.extends;
  } while (currentSkeleton);

  return skeletons;
}


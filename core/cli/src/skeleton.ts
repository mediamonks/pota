import { join } from "path";
import { promises as fs, realpathSync } from "fs";

const { readFile } = fs;

interface ProjectPotaConfig {
  default?: string;
}

interface PackageJsonShape {
  pota?: ProjectPotaConfig;
}

const getCWD = () => realpathSync(process.cwd());

async function readPackageJson(): Promise<PackageJsonShape> {

  const path = join(getCWD(), "package.json");

  return JSON.parse(await readFile(path, { encoding: "utf8" }));
}

export async function getSkeleton() {
  if (!process.env.POTA_SKELETON) {
    const defaultSkeleton = (await readPackageJson()).pota?.default;
    if (defaultSkeleton) process.env.POTA_SKELETON = defaultSkeleton;
  }
  // TODO: throw error if the pota skeleton isn't installed
  return process.env.POTA_SKELETON;
}



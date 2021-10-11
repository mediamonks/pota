import type { ProjectPotaConfig } from "@pota/shared/config";
import { readPackageJson, getCWD } from "@pota/shared/fs";

export async function getSkeletonName() {
  if (!process.env.POTA_SKELETON) {
    const config = (await readPackageJson(getCWD())).pota as ProjectPotaConfig | undefined;

    if (config?.default) process.env.POTA_SKELETON = config.default;
  }

  // TODO: throw error if the pota skeleton isn't installed
  return process.env.POTA_SKELETON;
}



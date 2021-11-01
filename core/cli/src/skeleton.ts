import { readPackageJson, getCWD } from "@pota/shared/fs";

export async function getSkeletonName() {
  if (!process.env.POTA_SKELETON) {
    const pkg = (await readPackageJson(getCWD())) 

    if (pkg?.pota) process.env.POTA_SKELETON = pkg.pota;
  }

  // TODO: throw error if the pota skeleton isn't installed
  return process.env.POTA_SKELETON;
}



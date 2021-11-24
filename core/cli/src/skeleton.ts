import { getCWD } from '@pota/shared/fs';
import { getSkeletonFromPath } from '@pota/shared/skeleton';

export async function getSkeletonName() {
  // TODO: throw error if the pota skeleton isn't installed
  return process.env.POTA_SKELETON || (await getSkeletonFromPath(getCWD()));
}

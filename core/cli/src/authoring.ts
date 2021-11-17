import { dirname, resolve } from 'path';

import { readPackageJson, getCWD, exists } from '@pota/shared/fs';
import { getNestedSkeletons } from '@pota/shared/skeleton';
import { POTA_LOCAL_SKELETON } from '@pota/shared/config';

export const PROJECT_SKELETON = POTA_LOCAL_SKELETON;

export async function getNestedFiles(filepath: string) {
  const cwd = getCWD();

  const pkg = await readPackageJson(cwd);

  if (!pkg.pota) throw new Error(`Could not determine the skeleton in '${cwd}'`);

  const nestedFiles = (await getNestedSkeletons(cwd, pkg.pota, dirname(filepath)))
    .map(({ skeleton, path, files }) => ({
      skeleton,
      file: files.some((filename) => filepath.endsWith(filename)) ? resolve(path, filepath) : null,
    }))
    .filter(Boolean);

  const projectFilepath = resolve(cwd, filepath);
  if (await exists(projectFilepath))
    nestedFiles.push({ skeleton: PROJECT_SKELETON, file: projectFilepath });

  return nestedFiles;
}

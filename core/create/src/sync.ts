import { join, dirname } from 'path';

import { PACKAGE_JSON_FILE, POTA_COMMANDS_DIR, POTA_DIR } from '@pota/shared/config';
import { getNestedSkeletons } from '@pota/shared/skeleton';

import ProjectPackage from './ProjectPackage.js';
import { copyFile, mkdir } from 'fs/promises';
import { exists } from '@pota/shared/fs';

async function copy(src: string, dst: string) {
  // create destination directories if they don't exist
  const dir = dirname(dst);
  if (!(await exists(dir))) await mkdir(dir, { recursive: true });

  await copyFile(src, dst);
}

export default async function sync(targetPath: string, skeleton: string, pkgName: string) {
  const nestedSkeletons = await getNestedSkeletons(targetPath, skeleton);

  const projectPkg = (await new ProjectPackage(targetPath).load())
    .setName(pkgName)
    .setDefaultSkeleton(skeleton);

  const commandsDir = join(POTA_DIR, POTA_COMMANDS_DIR);

  const fileMap = new Map<string, { src: string; dst: string }>();
  const omits: Array<string> = [];

  for (const { path, config, files } of nestedSkeletons) {
    if (config.omit) omits.push(...config.omit);
    for (const file of files) {
      if (file === PACKAGE_JSON_FILE) {
        await projectPkg.merge(path, config);
      } else if (file.startsWith(POTA_DIR)) {
        if (file.startsWith(commandsDir)) projectPkg.applyFileAsScript(file);
      } else {
        const renamed = config.rename?.[file] ?? file;
        fileMap.set(renamed, { src: join(path, file), dst: join(targetPath, renamed) });
      }
    }
  }

  for (const [file, { src, dst }] of fileMap.entries()) {
    if (!omits.includes(file)) await copy(src, dst);
  }

  await projectPkg.sort().write();
}

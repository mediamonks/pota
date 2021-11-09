import { join } from 'path';

import { copy } from 'fs-extra';
import { PACKAGE_JSON_FILE, POTA_COMMANDS_DIR, POTA_DIR } from '@pota/shared/config';
import { getNestedSkeletons } from '@pota/shared/skeleton';

import ProjectPackage from './ProjectPackage.js';

export default async function sync(targetPath: string, skeleton: string, pkgName: string) {
  const nestedSkeletons = await getNestedSkeletons(targetPath, skeleton);

  const projectPkg = (await new ProjectPackage(targetPath).load())
    .setName(pkgName)
    .setDefaultSkeleton(skeleton);

  const commandsDir = join(POTA_DIR, POTA_COMMANDS_DIR);

  for (const { path, config, files } of nestedSkeletons) {
    for (const file of files) {
      if (file.startsWith(commandsDir)) projectPkg.applyFileAsScript(file);
      if (file === PACKAGE_JSON_FILE) await projectPkg.merge(path, config);
      else {
        // TODO: instead of copying, store all the files in a list
        // that later can be processed to remove duplicate files from multiple skeletons and omit "config.omit" files
        const newName = config.rename && file in config.rename ? config.rename[file] : file;
        // TODO: implement own `copy`, so we can ditch `fs-extra`
        await copy(join(path, file), join(targetPath, newName));
      }
    }
  }

  await projectPkg.sort().write();
}

import { join, basename, extname } from 'path';

// @ts-ignore TS is being weird
import merge from 'lodash.merge';
import { sortPackageJson } from 'sort-package-json';
import { copy } from 'fs-extra';
import { readPackageJson, writePackageJson } from '@pota/shared/fs';
import { PACKAGE_JSON_FILE, POTA_COMMANDS_DIR, POTA_DIR } from '@pota/shared/config';
import type { PackageJsonShape } from '@pota/shared/config';
import { getNestedSkeletons } from '@pota/shared/skeleton';

import { POTA_CLI, POTA_CLI_BIN } from './config.js';

function filterObject<T extends Record<string, any>>(o: T, fields: ReadonlyArray<keyof T>) {
  type Result = Record<typeof fields[number], any>;

  let r: Result | undefined = undefined;

  for (const field of Object.keys(o) as ReadonlyArray<keyof T>) {
    if (fields.includes(field)) {
      r ??= {} as Result;
      r[field] = o[field];
    }
  }

  return r;
}

const FILTERED_PACKAGE_FIELDS = ['scripts'] as const;

const IGNORED_PACKAGE_FIELDS: ReadonlyArray<keyof PackageJsonShape> = [
  'dependencies',
  'devDependencies',
  'files',
  'publishConfig',
  'repository',
  'bugs',
  'author',
  'version',
];

export default async function sync(targetPath: string, skeleton: string, pkgName: string) {
  const nestedSkeletons = await getNestedSkeletons(targetPath, skeleton);

  let pkg = await readPackageJson(targetPath);

  const commandsDir = join(POTA_DIR, POTA_COMMANDS_DIR);
  const commandScripts: PackageJsonShape['scripts'] = {};
  let peerDependencies: PackageJsonShape['peerDependencies'] = {};

  for (const { path, config, files } of nestedSkeletons) {
    for (const file of files) {
      if (file.startsWith(POTA_DIR)) {
        if (file.startsWith(commandsDir)) {
          const command = basename(file, extname(file));

          commandScripts[command] = `${POTA_CLI_BIN} ${command}`;
        }
      } else if (file === PACKAGE_JSON_FILE) {
        const skeletonPkg = await readPackageJson(join(path));

        for (const field of IGNORED_PACKAGE_FIELDS) {
          delete skeletonPkg[field];
        }

        for (const field of FILTERED_PACKAGE_FIELDS) {
          let filtered = undefined;

          if (field in skeletonPkg && field in config) {
            filtered = filterObject(skeletonPkg[field]!, config[field]!);
          }

          skeletonPkg[field] = filtered;
        }

        if ('peerDependencies' in skeletonPkg) {
          peerDependencies = { ...peerDependencies, ...skeletonPkg?.peerDependencies };
          delete skeletonPkg.peerDependencies;
        }

        merge(pkg, skeletonPkg);
      } else {

        // TODO: instead of copying, store all the files in a list
        // that later can be processed to remove duplicate files from multiple skeletons and omit "config.omit" files
        const newName = config.rename && file in config.rename ? config.rename[file] : file;
        // TODO: implement own `copy`, so we can ditch `fs-extra`
        await copy(join(path, file), join(targetPath, newName));
      }
    }
  }

  // to make sure that peer dependencies are visible in the end project
  // we append them as dependencies to the project package
  //
  // extended skeletons are placed in the skeleton `peerDependencies`
  // and the below code makes sure that they are placed in `devDependencies` instead of `dependencies`
  for (const { skeleton } of nestedSkeletons) {
    if (skeleton in peerDependencies) {
      pkg.devDependencies ??= {};
      pkg.devDependencies[skeleton] = peerDependencies[skeleton];
      delete peerDependencies[skeleton];
    }
  }

  const hasPotaCLI = POTA_CLI in peerDependencies;

  if (hasPotaCLI) {
    pkg.devDependencies ??= {};
    pkg.devDependencies[POTA_CLI] = peerDependencies[POTA_CLI];
    delete peerDependencies[POTA_CLI];
  }

  if (Object.keys(peerDependencies).length > 0) {
    pkg.dependencies ??= {};
    pkg.dependencies = { ...pkg.dependencies, ...peerDependencies };
  }

  // set package name
  pkg.name = pkgName;

  // set default pota skeleton
  pkg.pota = skeleton;

  // add pota commands
  if (hasPotaCLI) {
    pkg.scripts ??= {};
    pkg.scripts = { ...commandScripts, ...pkg.scripts };
  }

  pkg = sortPackageJson(pkg);

  await writePackageJson(pkg, targetPath);
}

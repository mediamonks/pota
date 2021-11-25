import { join, dirname, basename, extname } from 'path';
import { copyFile, mkdir, writeFile } from 'fs/promises';

// @ts-ignore TypeScript is being weird
import merge from 'lodash.merge';
import { sortPackageJson } from 'sort-package-json';
import { PackageJsonShape, POTA_CONFIG_FILE } from '@pota/shared/config';
import { PotaConfig, PACKAGE_JSON_FILE, POTA_COMMANDS_DIR, POTA_DIR } from '@pota/shared/config';
import { getNestedSkeletons } from '@pota/shared/skeleton';
import { exists, readPackageJson, writePackageJson } from '@pota/shared/fs';

import { POTA_CLI, POTA_CLI_BIN } from './config.js';
// @ts-ignore TypeScript is being weird
import dedent from 'dedent';

function addFileAsScript(pkg: PackageJsonShape, file: string) {
  const command = basename(file, extname(file));

  pkg.scripts ??= {};
  pkg.scripts[command] = `${POTA_CLI_BIN} ${command}`;
}

const IGNORED_PACKAGE_FIELDS: ReadonlyArray<keyof PackageJsonShape> = [
  'name',
  'version',
  'peerDependencies',
  'dependencies',
  'devDependencies',
  'files',
  'publishConfig',
  'repository',
  'bugs',
  'author',
];

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

/*
 * Merges the fields of the package from `path` into the project package.
 */
async function mergeSkeleton(pkg: PackageJsonShape, path: string, config: PotaConfig) {
  const skeletonPkg = await readPackageJson(path);

  const { peerDependencies = {} } = skeletonPkg;

  for (const field of IGNORED_PACKAGE_FIELDS) {
    delete skeletonPkg[field];
  }

  if ('scripts' in skeletonPkg && 'scripts' in config) {
    skeletonPkg.scripts = filterObject(skeletonPkg.scripts!, config.scripts!);
  }

  merge(pkg, skeletonPkg);

  // place the skeleton package in `devDependencies`
  pkg.devDependencies ??= {};

  if (config.extends && config.extends in peerDependencies) {
    pkg.devDependencies[config.extends] = peerDependencies[config.extends];
  }

  for (const [dep, version] of Object.entries(peerDependencies)) {
    // place the `@pota/cli` (if it exists) package in `devDependencies`
    if (dep === POTA_CLI) pkg.devDependencies[POTA_CLI] = peerDependencies[POTA_CLI];
    // this `else if` condition makes sure that the dependency isn't defined in `devDependencies`
    // which might me the case for extended skeletons defined in `peerDependencies`
    else if (!(dep in pkg.devDependencies)) {
      pkg.dependencies ??= {};
      pkg.dependencies[dep] = version;
    }
  }
}

async function createPotaDir(path: string, skeleton: string) {
  path = join(path, POTA_DIR);

  // create in-project pota directoru
  await mkdir(path);

  path = join(path, POTA_CONFIG_FILE);

  // add config file with the extended skeleton
  await writeFile(
    path,
    dedent`
       export default {
         extends: "${skeleton}"
       };`,
  );
}

async function copy(src: string, dst: string) {
  // create destination directories if they don't exist
  const dir = dirname(dst);
  if (!(await exists(dir))) await mkdir(dir, { recursive: true });

  await copyFile(src, dst);
}

export default async function sync(targetPath: string, skeleton: string, pkgName: string) {
  const nestedSkeletons = await getNestedSkeletons(targetPath, skeleton);

  const pkg = await readPackageJson(targetPath);
  pkg.name = pkgName;

  const commandsDir = join(POTA_DIR, POTA_COMMANDS_DIR);

  const fileMap = new Map<string, { src: string; dst: string }>();
  const omits: Array<string> = [];

  for (const { path, config, files } of nestedSkeletons) {
    if (config.omit) omits.push(...config.omit);
    for (const file of files) {
      if (file === PACKAGE_JSON_FILE) await mergeSkeleton(pkg, path, config);
      else if (file.startsWith(POTA_DIR)) {
        if (file.startsWith(commandsDir)) addFileAsScript(pkg, file);
      } else {
        const renamed = config.rename?.[file] ?? file;
        fileMap.set(renamed, { src: join(path, file), dst: join(targetPath, renamed) });
      }
    }
  }

  for (const [file, { src, dst }] of fileMap.entries()) {
    if (!omits.includes(file)) await copy(src, dst);
  }

  await createPotaDir(targetPath, skeleton);

  await writePackageJson(sortPackageJson(pkg), targetPath);
}

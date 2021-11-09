import { basename, extname } from 'path';

// @ts-ignore TypeScript is being weird
import merge from 'lodash.merge';
import { sortPackageJson } from 'sort-package-json';
import { readPackageJson, writePackageJson } from '@pota/shared/fs';
import { PotaConfig } from '@pota/shared/config';
import type { PackageJsonShape } from '@pota/shared/config';

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

export default class ProjectPackage {
  private static ignoredFields: ReadonlyArray<keyof PackageJsonShape> = [
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

  private pkg: PackageJsonShape | null = null;

  constructor(private path: string) {}

  /*
   * Loads the package from disk via the provided `path`
   */
  async load() {
    this.pkg = await readPackageJson(this.path);

    return this;
  }

  /*
   * Adds the passed file basename as a `@pota/cli command to the `scripts`
   */
  applyFileAsScript(file: string) {
    if (!this.pkg) throw new Error('`setProjectPackage` must be called before `addFileAsScript`');

    const command = basename(file, extname(file));

    this.pkg.scripts ??= {};
    this.pkg.scripts[command] = `${POTA_CLI_BIN} ${command}`;
  }

  /*
   * Merges the fields of the package from `path` into the project package.
   */
  async merge(path: string, config: PotaConfig) {
    if (!this.pkg) {
      throw new Error('`setProjectPackage` must be called before `applySkeletonPackage`');
    }

    const skeletonPkg = await readPackageJson(path);

    const { name: skeleton, version, peerDependencies = {} } = skeletonPkg;

    for (const field of ProjectPackage.ignoredFields) {
      delete skeletonPkg[field];
    }

    if ('scripts' in skeletonPkg && 'scripts' in config) {
      skeletonPkg.scripts = filterObject(skeletonPkg.scripts!, config.scripts!);
    }

    merge(this.pkg, skeletonPkg);

    // place the skeleton package in `devDependencies`
    this.pkg.devDependencies ??= {};
    this.pkg.devDependencies[skeleton!] = `^${version!}`;

    for (const [dep, version] of Object.entries(peerDependencies)) {
      // place the `@pota/cli` (if it exists) package in `devDependencies`
      if (dep === POTA_CLI) this.pkg.devDependencies[POTA_CLI] = peerDependencies[POTA_CLI];
      // this `else if` condition makes sure that the dependency isn't defined in `devDependencies`
      // which might me the case for extended skeletons defined in `peerDependencies`
      else if (!(dep in this.pkg.devDependencies)) {
        this.pkg.dependencies ??= {};
        this.pkg.dependencies[dep] = version;
      }
    }
  }

  /*
   * Sorts package fields using `sort-package-json`
   */
  sort() {
    if (!this.pkg) throw new Error('`setProjectPackage` must be called before `sort`');

    this.pkg = sortPackageJson(this.pkg);

    return this;
  }

  /*
   * Sets the `pota` field.
   */
  setDefaultSkeleton(skeleton: string) {
    if (!this.pkg) {
      throw new Error('`setProjectPackage` must be called before `setDefaultSkeleton`');
    }

    this.pkg.pota = skeleton;

    return this;
  }

  /*
   * Sets the `name` field.
   */
  setName(name: string) {
    if (!this.pkg) throw new Error('`setProjectPackage` must be called before `setName`');

    this.pkg.name = name;

    return this;
  }

  /*
   * Writes the package back to the `path`
   */
  async write() {
    if (!this.pkg) throw new Error('`setProjectPackage` must be called before `write`');

    await writePackageJson(this.pkg, this.path);
  }
}

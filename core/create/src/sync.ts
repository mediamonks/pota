import { pathToFileURL } from 'url';
import { join, dirname, resolve } from 'path';
import { access, copyFile, mkdir, writeFile } from 'fs/promises';

// @ts-ignore TypeScript is being weird
import merge from 'lodash.merge';
import { sortPackageJson } from 'sort-package-json';
import { PackageJsonShape } from '@pota/authoring';
import { Skeleton } from '@pota/authoring';

// @ts-ignore TypeScript is being weird
import dedent from 'dedent';
import { readPackageJson, Recursive, writePackageJson } from './helpers.js';
import { camelCase } from 'change-case';

const IGNORED_PACKAGE_FIELDS: ReadonlyArray<keyof PackageJsonShape> = [
  'name',
  'exports',
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
async function mergeSkeleton(
  pkg: PackageJsonShape,
  path: string,
  permittedScripts?: ReadonlyArray<string>,
) {
  const skeletonPkg = await readPackageJson(path);

  const { peerDependencies = {} } = skeletonPkg;

  for (const field of IGNORED_PACKAGE_FIELDS) {
    delete skeletonPkg[field];
  }

  if ('scripts' in skeletonPkg && permittedScripts) {
    skeletonPkg.scripts = filterObject(skeletonPkg.scripts!, permittedScripts);
  }

  merge(pkg, skeletonPkg);

  // place the skeleton package in `devDependencies`
  pkg.devDependencies ??= {};

  for (const [dep, version] of Object.entries(peerDependencies)) {
    // make sure that the dependency isn't defined in `devDependencies`
    // which might me the case for extended skeletons defined in `peerDependencies`
    if (!(dep in pkg.devDependencies)) {
      pkg.dependencies ??= {};
      pkg.dependencies[dep] = version;
    }
  }
}

function parseVarNameFromSkeleton(skeleton: string): string {
  let varName = skeleton.startsWith("@pota") ? skeleton.substring("@pota/".length) : skeleton;

  return camelCase(varName);
}

async function createPotaDir(path: string, skeleton: string) {
  path = join(path, '.pota');

  // create in-project pota directoru
  await mkdir(path);

  path = join(path, 'config.js');

  const varName = parseVarNameFromSkeleton(skeleton);

  // add config file with the extended skeleton
  await writeFile(
    path,
    dedent`
      import ${varName} from '${skeleton}';
      import { define } from '@pota/authoring';

      export default define(${varName});
       `,
  );
}

async function copy(src: string, dst: string) {
  // create destination directories if they don't exist
  const dir = dirname(dst);

  try {
    await access(dir);
  } catch {
    await mkdir(dir, { recursive: true });
  }

  await copyFile(src, dst);
}

type ExtendingConfig = Skeleton.Config & { extends?: ExtendingConfig };

function order<C extends ExtendingConfig>(config: C) {
  const ordered: Array<Skeleton.Config> = [config];

  let current: ExtendingConfig | undefined = config.extends;

  while (current) {
    ordered.unshift(current);
    current = current.extends;
  }

  return ordered;
}

interface SyncOptions {
  potaDir?: boolean;
  addCLI?: boolean;
}

const DEFAULT_SYNC_OPTIONS: SyncOptions = { potaDir: true, addCLI: true };

export default async function sync(
  targetPath: string,
  skeleton: string,
  pkgName: string,
  options: SyncOptions = DEFAULT_SYNC_OPTIONS,
) {
  options = { ...DEFAULT_SYNC_OPTIONS, ...options };

  const configPath = resolve(targetPath, 'node_modules', skeleton, '.pota/config.js');

  const config: Skeleton.Config = (await import(pathToFileURL(configPath).toString())).default;

  const pkg = await readPackageJson(targetPath);

  const fileMap = new Map<string, { src: string; dst: string }>();
  const omits: Array<string> = [".pota", "package-lock.json", "node_modules"];

  for (const { omit, dirname, rename, scripts } of order(config)) {
    if (omit) omits.push(...omit);

    const skeletonRoot = resolve(dirname, '..');

    for (const file of await Recursive.readdir(skeletonRoot)) {
      if (file === 'package.json') await mergeSkeleton(pkg, skeletonRoot, scripts);
      else {
        const renamed = rename?.[file] ?? file;
        fileMap.set(renamed, { src: join(skeletonRoot, file), dst: join(targetPath, renamed) });
      }
    }
  }

  for (const [file, { src, dst }] of fileMap.entries()) {
    if (!omits.some((omit) => omit === file || dirname(file).startsWith(omit))) {
      console.log(dst);
      await copy(src, dst);
    }
  }

  if (options.potaDir) await createPotaDir(targetPath, skeleton);

  pkg.name = pkgName;

  if (options.addCLI) {
    for (const command of Object.keys(config.commands ?? {})) {
      pkg.scripts ??= {};
      if (!(command in pkg.scripts)) pkg.scripts[command] = `pota ${command}`;
    }
  }

  await writePackageJson(sortPackageJson(pkg), targetPath);
}

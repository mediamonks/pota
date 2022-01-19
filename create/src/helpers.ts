import { exec, SpawnOptions } from 'child_process';
import { PackageJsonShape } from '@pota/authoring';
import { readdir, rm, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import type { Result as NpaResult } from 'npm-package-arg';
import crossSpawn from 'cross-spawn';
import kleur from 'kleur';

const { green, cyan } = kleur;

export const log = (text: string = '') => console.log(text);

function createSpawn(options: SpawnOptions) {
  return (command: string, ...args: string[]): Promise<void> =>
    new Promise<void>((resolve, reject) =>
      crossSpawn(command, args, options)
        .on('close', (code) =>
          code !== 0 ? reject({ command: `${command} ${args.join(' ')}` }) : resolve(),
        )
        .on('error', reject),
    );
}

export const spawn = createSpawn({ stdio: 'inherit' });

export function command(command: string, quiet: boolean = true) {
  return new Promise<string | undefined>((resolve, reject) =>
    exec(command, (error, stdout, stderr) => {
      if (error) return reject(error);
      resolve(quiet ? undefined : stdout || stderr);
    }),
  );
}

export function createBailer(dir?: string) {
  return async () => {
    if (dir) {
      try {
        log();
        console.error('Deleting created directory.');
        await rm(dir, { recursive: true });
      } catch {}
    }

    process.exit(1);
  };
}

function normalizePackagePath(path: string, filename: string = 'package.json') {
  if (!path.endsWith(filename)) {
    return join(path, filename);
  }

  return path;
}

const READ_CACHE = new Map<string, PackageJsonShape>();

export async function readPackageJson(path: string) {
  path = normalizePackagePath(path);

  if (!READ_CACHE.has(path)) {
    const json: PackageJsonShape = JSON.parse(await readFile(path, { encoding: 'utf8' }));

    READ_CACHE.set(path, json);
  }

  return READ_CACHE.get(path)!;
}

export async function writePackageJson(object: PackageJsonShape, path: string) {
  path = normalizePackagePath(path);

  await writeFile(path, JSON.stringify(object, null, 2), { encoding: 'utf8' });
}

export class Recursive {
  static async readdir(dir: string) {
    const files = await readdir(dir, { withFileTypes: true });
    const finalFiles: Array<string> = [];

    for (const file of files) {
      if (file.isFile()) finalFiles.push(file.name);
      else if (file.isDirectory()) {
        // sub files come in relative to `file.name`
        const subFiles = await Recursive.readdir(join(dir, file.name));
        // we have to prepend the `file.name` so the path is always relative to `dir`
        finalFiles.push(...subFiles.map((filename) => join(file.name, filename)));
      }
    }

    return finalFiles;
  }
}

export async function getSkeletonName(skeletonPkgDetails: NpaResult, packageJsonPath: string) {
  const { dependencies = {}, devDependencies = {} } = await readPackageJson(packageJsonPath);

  const dependency = [dependencies, devDependencies]
    .flatMap((d) => Object.entries(d))
    .find(([name, version]) => {
      switch (skeletonPkgDetails.type) {
        case 'git': {
          const { user, type, project } = skeletonPkgDetails.hosted!;

          // github:mediamonks/pota#feature
          let shortName = `${type}:${user}/${project}`;
          if (skeletonPkgDetails.gitCommittish) {
            shortName += `#${skeletonPkgDetails.gitCommittish}`;
          }

          return version === shortName || version === skeletonPkgDetails.rawSpec;
        }
        case 'directory':
        case 'file':
          return version === `file:${skeletonPkgDetails.rawSpec}`;
        default:
          return name === skeletonPkgDetails.raw;
      }
    });

  if (!dependency) {
    throw new Error(`Could not find ${cyan(skeletonPkgDetails.raw)} in ${green(packageJsonPath)}`);
  }

  return dependency[0]; // the name of the dependency
}

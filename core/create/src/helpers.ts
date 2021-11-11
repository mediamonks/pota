import { exec, SpawnOptions } from 'child_process';
import { rm, mkdir } from 'fs/promises';

import type { Result as NpaResult } from 'npm-package-arg';
import crossSpawn from 'cross-spawn';
import kleur from 'kleur';
import { readPackageJson, isDirectoryAvailable } from '@pota/shared/fs';

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

export async function createDir(path: string) {
  if (await isDirectoryAvailable(path)) await mkdir(path, { recursive: true });
  else throw new Error(`${green(path)} already exists, please specify a different directory`);
}

export async function getSkeletonName(skeletonPkgDetails: NpaResult, packageJsonPath: string) {
  const { dependencies = {}, devDependencies = {} } = await readPackageJson(packageJsonPath);

  const dependency = [dependencies, devDependencies]
    .flatMap((d) => Object.entries(d))
    .find(([name, version]) => {
      switch (skeletonPkgDetails.type) {
        case 'git': {
          const { gitCommittish, hosted } = skeletonPkgDetails;
          const { user, type, project } = hosted!;

          // github:mediamonks/pota#feature
          return (
            version === `${type}:${user}/${project}#${gitCommittish}` ||
            version === skeletonPkgDetails.rawSpec
          );
        }
        case 'file':
          return version === skeletonPkgDetails.saveSpec;
        default:
          return name === skeletonPkgDetails.raw;
      }
    });

  if (!dependency) {
    throw new Error(`Could not find ${cyan(skeletonPkgDetails.raw)} in ${green(packageJsonPath)}`);
  }

  return dependency[0]; // the name of the dependency
}

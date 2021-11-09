import { join, resolve } from 'path';
import { realpathSync } from 'fs';
import { access, readdir, readFile, writeFile } from 'fs/promises';

import type { PackageJsonShape } from './config.js';
import { PACKAGE_JSON_FILE } from './config.js';

export const getCWD = () => realpathSync(process.cwd());

export const resolveUser: typeof resolve = (...pathSegments) => resolve(getCWD(), ...pathSegments);

export async function isDirectoryAvailable(dir: string) {
  return !(await exists(dir));
}

export async function exists(path: string) {
  try {
    await access(path);
  } catch (error) {
    return false;
  }

  return true;
}

export function normalizePackagePath(path: string, postfix: string = PACKAGE_JSON_FILE) {
  // append "package.json" if the path doesn't include it
  if (!path.endsWith(postfix)) {
    return join(path, postfix);
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

interface ReaddirOptions {
  omit?: ReadonlyArray<string>;
  include?: ReadonlyArray<string>;
}

export class Recursive {
  static async readdir(dir: string, { omit, include }: ReaddirOptions = {}) {
    const files = await readdir(dir, { withFileTypes: true });
    const finalFiles: Array<string> = [];

    for (const file of files) {
      if (omit?.includes(file.name) || (include && !include.includes(file.name))) continue;
      else if (file.isFile()) finalFiles.push(file.name);
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

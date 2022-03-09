import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';

import { command } from './spawn.js';

export function normalizePackagePath(path: string, filename: string = 'package.json') {
  if (!path.endsWith(filename)) {
    return join(path, filename);
  }

  return path;
}

export interface PackageJsonShape {
  private?: true;
  exports?: unknown;
  license?: string;
  bin?: string | Record<string, string>;
  description?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  files?: ReadonlyArray<string>;
  publishConfig?: Record<string, unknown>;
  repository?: Record<string, string>;
  bugs?: Record<string, string>;
  author?: string;
  name?: string;
  version?: string;
  keywords?: ReadonlyArray<string>;
  pota?:
    | string
    | {
        commands: Record<string, { description?: string; suggest?: boolean }>;
      };
}

export type PackageJsonShapeKey = keyof PackageJsonShape;

export async function readPackageJson(path: string): Promise<PackageJsonShape> {
  path = normalizePackagePath(path);

  return JSON.parse(await readFile(path, { encoding: 'utf8' }));
}

export async function writePackageJson(path: string, pkg: PackageJsonShape) {
  path = normalizePackagePath(path);

  await writeFile(path, JSON.stringify(pkg, null, 2), { encoding: 'utf8' });
}

export type PackageInfo = PackageJsonShape & {
  dist: { tarball: string };
  'dist-tags': { latest: string };
};

export async function getPackageInfo(pkg: string): Promise<PackageInfo> {
  const raw = await command(`npm info ${pkg} --json`, false);

  return raw ? JSON.parse(raw) : null;
}

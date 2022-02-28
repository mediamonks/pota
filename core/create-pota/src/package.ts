import { join, relative, resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';

const IS_WINDOWS = process.platform === 'win32';
const HAS_SLASHES = IS_WINDOWS ? /\\|[/]/ : /[/]/;

const IS_URL_NPM_PACKAGE = /^(?:git[+])?[a-z]+:/i;
const IS_GIT_NPM_PACKAGE = /^[^@]+@[^:.]+\.[^:]+:.+$/i;
const IS_FILENAME_NPM_PACKAGE = /[.](?:tgz|tar.gz|tar)$/i;

export function normalizePackageName(
  name: string,
  cwd: string,
  projectPath: string,
): string & { isFilenamePackage?: boolean; isGitPackage?: boolean } {
  if (IS_GIT_NPM_PACKAGE.test(name) || IS_URL_NPM_PACKAGE.test(name)) {
    const [gitServer, actualName] = name.split(':');
    if (actualName && gitServer === 'git@github.com') {
      return Object.assign(`github:${actualName.replace('.git', '')}`, { isGitPackage: true });
    }
    return Object.assign(name, { isGitPackage: true });
  }

  if (IS_FILENAME_NPM_PACKAGE.test(name) || (HAS_SLASHES.test(name) && !name.startsWith('@'))) {
    return Object.assign(relative(projectPath, resolve(cwd, name)), { isFilenamePackage: true });
  }

  return name;
}

export function normalizePackagePath(path: string, filename: string = 'package.json') {
  if (!path.endsWith(filename)) {
    return join(path, filename);
  }

  return path;
}

export interface PackageJsonShape {
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
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
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

import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';

import { command } from './util/spawn.js';
import { SupportedScripts } from './prompts/scripts.js';

export interface PackageJsonShape<T = unknown> {
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
  'create-pota'?: T;
  pota?: ReadonlyArray<string>;
}

export type TemplatePackageJson = PackageJsonShape<{
  scripts?: SupportedScripts;
}>;
export type ScriptsPackageJson = PackageJsonShape<{
  commands: Record<string, { description?: string; suggest?: boolean }>;
}>;

export type PackageJsonShapeKey = keyof PackageJsonShape;

export const IGNORED_PACKAGE_KEYS: ReadonlyArray<PackageJsonShapeKey> = [
  'name',
  'version',
  'author',
  'bin',
  'bugs',
  'description',
  'exports',
  'files',
  'license',
  'create-pota',
  'publishConfig',
  'repository',
  'keywords',
];

/**
 * appends 'package.json' to the specified path, if its not already there
 */
export function normalizePackagePath(path: string, filename: string = 'package.json') {
  if (!path.endsWith(filename)) {
    return join(path, filename);
  }

  return path;
}

const GIT_REGEX = /((git|ssh|http(s)?)|(git@[\w\.]+))(:(\/\/)?)([\w\.@\:/\-~]+)(\.git)(\/)?/;

/**
 * checks if the specified npm package name is a git package
 */
export function isGitPackage(pkg: string) {
  return GIT_REGEX.test(pkg) || pkg.startsWith('bitbucket:') || pkg.startsWith('github:');
}

const IS_WINDOWS = process.platform === 'win32';
const HAS_SLASHES = IS_WINDOWS ? /\\|[/]/ : /[/]/;

/**
 * checks if the specified npm package name is a file package
 */
export function isFilePackage(pkg: string) {
  return HAS_SLASHES.test(pkg) && !pkg.startsWith('@');
}

export function isRegistryPackage(pkg: string) {
  return !isFilePackage(pkg) && !isGitPackage(pkg);
}

/**
 * reads the package.json of the specified path
 */
export async function readPackageJson<T = PackageJsonShape>(path: string): Promise<T> {
  path = normalizePackagePath(path);

  return JSON.parse(await readFile(path, { encoding: 'utf8' }));
}

/**
 * writes to the package.json of the specified path
 */
export async function writePackageJson(path: string, pkg: PackageJsonShape) {
  path = normalizePackagePath(path);

  await writeFile(path, JSON.stringify(pkg, null, 2), { encoding: 'utf8' });
}

/**
 * retrieves the package info (npm registry metadata, including package.json)
 */
export async function getPackageInfo(
  pkg: string,
  ...fields: ReadonlyArray<string>
): Promise<unknown> {
  const rawResponse = await command(`npm info ${pkg} ${fields.join(' ')} --json`, false);

  if (!rawResponse) throw new Error(`could not find ${pkg} ${fields.join(' ')} metadata`);

  return JSON.parse(rawResponse);
}

/**
 * @description Reconstructs postinstall script, moves all rebuilds to start of postinstall and removes duplicates.
 * @param postInstall
 */
export function cleanupPostInstall(postInstall: string) {
  // add ; to end to make sure we match all npm rebuilds
  postInstall = postInstall[postInstall.length - 1] === ';' ? postInstall : `${postInstall};`;

  // find post install rebuilds (matches: "npm rebuild package;" or "npm rebuild package &&"
  const rebuilds = postInstall.match(/npm rebuild ([\w\s-]+(&&|;))/gi) ?? [];

  if (rebuilds.length === 0) {
    return postInstall.substring(0, postInstall.length - 1);
  }

  // remove rebuilds from post-install
  rebuilds.forEach((rebuild) => {
    postInstall = postInstall.replace(rebuild, "");
  });

  // Make sure or postInstall string doesn't end with && or ;
  postInstall = postInstall.trim().replace(/&?&?\s?;?$/, "");

  const parsedRebuilds = rebuilds
       // get unique package names
      .flatMap((rebuild) => rebuild.replace(/&&|;/gi, '').replace('npm rebuild', '').split(" "))
      .filter((rebuild) => rebuild.length > 0)
      // remove duped packages
      .reduce<Array<string>>((previousValue, currentValue) => {
        if (previousValue.indexOf(currentValue) === -1) {
          previousValue.push(currentValue);
        }
        return previousValue;
      }, [])
      .join(' ');

  return `npm rebuild ${parsedRebuilds} --ignore-scripts=false && ${postInstall}`.replace(/[\s]{2,}/g, " ").trim();
}
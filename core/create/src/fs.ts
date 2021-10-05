import { join, resolve } from "path";

import { PACKAGE_JSON_FILE, POTA_CONFIG_FILE, POTA_PACKAGE_JSON_FILE } from "./config.js";
import { SkeletonConfig } from "@pota/skeleton-config";
import { promises as fs, realpathSync } from "fs";
import { copy } from "fs-extra"

const { access, readdir, readFile, writeFile } = fs;

export const getCWD = () => realpathSync(process.cwd());

export const resolveUser: typeof resolve = (...pathSegments) =>
  resolve(getCWD(), ...pathSegments);

export async function isDirectoryAvailable(dir: string) {
  try { 
    await access(dir);
  } catch (error) {
    return true;
  }

  return false;
}

export function normalizePackagePath(path: string, postfix: string = PACKAGE_JSON_FILE) {
  // append "package.json" if the path doesn't include it
  if (!path.endsWith(postfix)) {
    return join(path, postfix); 
  }

  return path;
}

export async function readPotaConfig(path: string): Promise<SkeletonConfig> {
  if (!(path.endsWith(POTA_CONFIG_FILE))) {
    path = join(path, POTA_CONFIG_FILE);
  }

  return await import(path);
}

export interface PackageJsonShape { 
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

const READ_CACHE = new Map<string, PackageJsonShape>();

export async function readPackageJson(path: string, isPota: boolean = false) {
  path = normalizePackagePath(path, isPota ? POTA_PACKAGE_JSON_FILE : undefined);
  
  if (!READ_CACHE.has(path)) {
    const json: PackageJsonShape = JSON.parse(await readFile(path, { encoding: "utf8" }));

    READ_CACHE.set(path, json);
  }

  return READ_CACHE.get(path)!;
}

export async function writePackageJson(object: PackageJsonShape, path: string) {
  path = normalizePackagePath(path);

  await writeFile(path, JSON.stringify(object, null, 2), { encoding: "utf8" })
}

interface FileSynchronizerOptions {
  exclude?: ReadonlyArray<string>;
  transformFiles?: Record<string, { newName?: string, transformSource?: (source: string) => string }>;
}

export async function synchronizeFiles(sourcePath: string, targetPath: string, options: FileSynchronizerOptions = {}) {
  const { exclude = [], transformFiles = {} } = options;

  let files = (await readdir(sourcePath)).map((filename) => [join(sourcePath, filename), filename]);

  if (exclude.length > 0) {
    files = files.filter(([, filename]) => !exclude.includes(filename));
  }

  for (const file of files) {
    const [path] = file;
    let [, filename] = file;

    // ensure the skeleton file exists
    if (await isDirectoryAvailable(path)) {
      // TODO: add logging + debug mode
      continue;
    }

    // apply file transformations, if any exist
    if (filename in transformFiles) {
      const { newName, transformSource } = transformFiles[filename];

      // apply new name
      if (newName) {
        filename = newName;
      }

      // TODO: before transform, check if it is a file or folder
      // transform file source
      // and write the result to the target
      if (transformSource) {
        let source = await readFile(path, { encoding: "utf-8" });

        try {
          const transformedSource = transformSource(source);
          source = transformedSource;
        } catch(error) { } // TODO: add logging + debug mode

        await writeFile(join(targetPath, filename), source);

        // we are writing the transformed source directly to the target
        // so we don't have to copy the original file
        continue;
      }
    } 

    // TODO: get rid of "fs-extra"
    // move file to the target
    await copy(path, join(targetPath, filename));
  }
}


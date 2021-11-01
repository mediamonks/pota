import { join, basename, extname } from "path";

import { copy } from "fs-extra"
import { readPackageJson, writePackageJson } from "@pota/shared/fs";
import { PACKAGE_JSON_FILE, POTA_COMMANDS_DIR, POTA_DIR } from "@pota/shared/config";
import type { PackageJsonShape } from "@pota/shared/config";

import { getNestedSkeletons } from "@pota/shared/skeleton";

import { POTA_CLI_BIN } from "./config.js";
// @ts-ignore TS is being weird
import merge from "lodash.merge";
import { sortPackageJson } from "sort-package-json";

function filterObject<T extends Record<string, any>>(o: T, fields: ReadonlyArray<keyof T>) {
  type Result = Record<typeof fields[number], any>;

  let r: Result | undefined = undefined;

  for (const field of Object.keys(o) as ReadonlyArray<keyof T>) {
    if (fields.includes(field)) {
      r ??= {} as Result;
      r[field] = o[field]
    }
  }

  return r;
}


const FILTERED_PACKAGE_FIELDS = [
  "dependencies",
  "devDependencies",
  "scripts",
] as const;


const IGNORED_PACKAGE_FIELDS: ReadonlyArray<keyof PackageJsonShape> = [
  "files",
  "publishConfig",
  "repository",
  "bugs",
  "author",
  "version"
];

export default async function sync(targetPath: string, skeleton: string, pkgName: string) {
  let pkg = await readPackageJson(targetPath)

  const commandsDir = join(POTA_DIR, POTA_COMMANDS_DIR);
  const commandScripts: PackageJsonShape["scripts"] = {};

  for (const { path, config, files } of await getNestedSkeletons(targetPath, skeleton)) {
    for (const file of files) {
      if (file.startsWith(POTA_DIR)) {
        if (file.startsWith(commandsDir)) {
          const command = basename(file, extname(file));

          commandScripts[command] = `${POTA_CLI_BIN} ${command}`;
        }
      }
      else if (file === PACKAGE_JSON_FILE) {
        const skeletonPkg = await readPackageJson(join(path));

        for (const field of IGNORED_PACKAGE_FIELDS) {
          delete skeletonPkg[field];
        }

        for (const field of FILTERED_PACKAGE_FIELDS) {
          let filtered = undefined;

          if (field in skeletonPkg && field in config) {
            filtered = filterObject(skeletonPkg[field]!, config[field]!);
          }

          skeletonPkg[field] = filtered;
        }

        merge(pkg, skeletonPkg)

      } else {
        const newName = config.rename && file in config.rename ? config.rename[file] : file;
        await copy(join(path, file), join(targetPath, newName))
      }
    }
  }

  pkg.name = pkgName;
  pkg.pota = skeleton;

  pkg = sortPackageJson(pkg)

  pkg.scripts ??= {};
  pkg.scripts = { ...commandScripts, ...pkg.scripts, };

  await writePackageJson(pkg, targetPath);
}






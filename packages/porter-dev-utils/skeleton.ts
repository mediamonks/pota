import jscodeshift, { Collection } from "jscodeshift";
import fs from "fs-extra";
import path from "path";
import { PackageJSONShape, SkeletonType } from "./types";
import { createSkeletonDependency, SKELETON_TOOL_MAP } from "./config";
import { typedObjectEntries } from "@psimk/typed-object";

// FILE SYNCING

type SkeletonFile =
  | string
  | [
      name: string,
      transform?: (source: string) => string,
      nameTransform?: (string: string) => string
    ];

export function createFileSynchronizer(type: SkeletonType, files: SkeletonFile[]) {
  const SKELETON_DEPENDENCY = createSkeletonDependency(type);

  return (projectPath: string) => {
    for (let file of files) {
      if (typeof file === "string") {
        // setup paths
        const filePath = path.join(projectPath, "node_modules", SKELETON_DEPENDENCY, file);

        const outPath = path.join(projectPath, file);

        // check if the skeleton file exists
        if (!fs.existsSync(filePath)) {
          console.log(`'${filePath}' doesn't exist`);
          continue;
        }

        // copy from skeleton to new project
        fs.copySync(filePath, outPath);
      } else {
        let [fileName] = file;

        // setup paths
        const sourcePath = path.join(projectPath, "node_modules", SKELETON_DEPENDENCY, fileName);

        // check if the skeleton file exists
        if (!fs.existsSync(sourcePath)) {
          console.log(`'${sourcePath}' doesn't exist`);
          continue;
        }

        const [, transform, nameTransform] = file;

        // read from skeleton
        let fileSource = fs.readFileSync(sourcePath, { encoding: "utf-8" });

        // transform
        fileSource = transform?.(fileSource) ?? fileSource;

        // transform file name
        fileName = nameTransform?.(fileName) ?? fileName;

        // write to new project
        fs.writeFileSync(path.join(projectPath, fileName), fileSource);
      }
    }
  };
}

// DEPENDENCY SYNCING

export function createDependencySynchronizer(type: SkeletonType, dependencies: string[]) {
  const SKELETON_DEPENDENCY = createSkeletonDependency(type);

  return (projectPath: string) => {
    // get skeleton dependencies from the skeleton package.json
    const { dependencies: skeletonDependencyMap } = require(path.join(
      projectPath,
      "node_modules",
      SKELETON_DEPENDENCY,
      "package.json"
    )) as PackageJSONShape;

    const skeletonDependencies = typedObjectEntries(skeletonDependencyMap).filter(([dependency]) =>
      dependencies.includes(dependency)
    );

    const packageJSONPath = path.join(projectPath, "package.json");

    // get the project's package.json
    const packageJSON = fs.readJsonSync(packageJSONPath) as PackageJSONShape;

    if (!("dependencies" in packageJSON)) {
      packageJSON.dependencies = {};
    }

    // apply the skeleton's dependencies and versions to the project's package.json
    for (const [dependency, version] of skeletonDependencies) {
      packageJSON.dependencies[dependency] = version;
    }

    fs.writeJSONSync(packageJSONPath, packageJSON);
  };
}

// SCRIPT SYNCING

export function createScriptSynchronizer(
  type: SkeletonType,
  scripts: string[],
  additionalScripts: (string | [event: string, command: string])[]
) {
  const SKELETON_DEPENDENCY = createSkeletonDependency(type);

  return (projectPath: string) => {
    // get skeleton scripts from the skeleton package.json
    const { scripts: skeletonScriptMap } = require(path.join(
      projectPath,
      "node_modules",
      SKELETON_DEPENDENCY,
      "package.json"
    )) as PackageJSONShape;

    const skeletonScripts = [
      ...typedObjectEntries(skeletonScriptMap).filter(([script]) => scripts.includes(script)),
      ...additionalScripts.map((script) =>
        typeof script === "string"
          ? ([script, `porter ${SKELETON_TOOL_MAP[type]} ${script}`] as const)
          : script
      ),
    ];

    const packageJSONPath = path.join(projectPath, "package.json");

    // get the project's package.json
    const packageJSON = fs.readJsonSync(packageJSONPath) as PackageJSONShape;

    if (!("scripts" in packageJSON)) {
      packageJSON.scripts = {};
    }

    // apply the skeleton's scripts to the project's package.json
    for (const [event, command] of skeletonScripts) {
      packageJSON.scripts[event] = command;
    }

    fs.writeJSONSync(packageJSONPath, packageJSON);
  };
}

// MISCELLANEOUS

export const appendEslintRule = (collection: Collection<any>, insertion: any) =>
  collection
    // find `rules' property
    .find(jscodeshift.Property, (property) => property.key.name === "rules")
    // find first property
    .find(jscodeshift.Property)
    .insertAfter(insertion);

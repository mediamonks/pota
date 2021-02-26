import * as path from "path";
import * as fs from "fs";
import mkdirp from "mkdirp";
import validatePackageName from "validate-npm-package-name";
import kleur from "kleur";

import { banner, clear, command, spawn, spawnSilent } from "./utils/cli";
import { CLI_DEPENDENCY, INVERTED_SKELETON_SHORTHANDS } from "./config";
import { PorterSkeletonInterface } from "./authoring/skeleton";
import { withSynchronizers } from "./utils/skeleton";

type CreateOptions = {
  porterPackage: string;
};

/**
 * @returns absolute cwd (current working directory) path
 */
const getCWD = () => fs.realpathSync(process.cwd());

const resolveUser: typeof path.resolve = (...pathSegments) =>
  path.resolve(getCWD(), ...pathSegments);

function validateProjectName(projectName: string) {
  const { validForNewPackages, errors, warnings } = validatePackageName(projectName);
  if (!validForNewPackages) {
    console.log(kleur.red(`${kleur.green(`"${projectName}"`)} is not a valid NPM package name:`));
    console.log();
    for (const error of [...(errors ?? []), ...(warnings ?? [])]) {
      console.error(kleur.red(`- ${error}\n`));
    }
    process.exit(1);
  }
}

export async function create(
  skeletonType: string,
  projectPath: string,
  { porterPackage }: CreateOptions
) {
  // normalize the path
  projectPath = resolveUser(path.normalize(projectPath));

  const projectName = path.basename(projectPath);

  validateProjectName(projectName);

  clear();
  banner("Porter", require("../package.json").version, "💁");

  console.log(`🏭 Creating ${kleur.green(projectName)}`);

  console.log(`🌊 Using ${kleur.yellow(projectPath)} as the project path`);
  if (porterPackage !== CLI_DEPENDENCY) {
    console.log(`👷 Using ${kleur.cyan(porterPackage)} as the project's porter CLI`);
  }

  // initialize git repo

  try {
    // create the project's directory
    mkdirp.sync(projectPath);
    command(`git --git-dir=${projectPath}/.git init`);
  } catch (error) {
    console.log("failed initializing git repo", error);
    process.exit(1);
  }

  // console.log(`📒 Initialized git repository.`);

  console.log();
  console.log(
    `🔋 Installing ${kleur.cyan(skeletonType)} skeleton's dependencies, this might take a while...`
  );
  console.log();

  let skeletonDependency = (INVERTED_SKELETON_SHORTHANDS[skeletonType] as string) ?? skeletonType;
  // make sure the current working directory is the projects' path
  const commonArgs = ["--cwd", projectPath];

  try {
    // initialize project using `yarn`
    await spawnSilent(
      `yarn`,
      ...commonArgs,
      "init",
      "-y",
      "-s",
      "--no-lockfile",
      "--non-interactive"
    );

    // add `skeleton` and `tools` dependencies
    await spawn(`yarn`, ...commonArgs, "add", porterPackage, skeletonDependency);
  } catch (error) {
    console.error(error);
    return process.exit(1);
  }

  // perform skeleton synchronizations

  console.log();
  console.log(`💫 Synchronizing the skeleton...`);
  console.log();

  try {
    if (skeletonDependency.startsWith("file:")) {
      const { dependencies = {} } = require(path.join(projectPath, "package.json"));
      [skeletonDependency] = Object.entries(dependencies as Record<string, string>).find(
        // if it's a local dependency, then it will be the `version` in the dependency list
        ([, version]) => version === skeletonDependency
      ) ?? [skeletonDependency];
    }
    const skeletonPath = path.join(projectPath, "node_modules", skeletonDependency);

    const BaseSkeleton = (await import(path.join(skeletonPath, "porter.ts")))?.default;

    const Skeleton = withSynchronizers(BaseSkeleton as { new (): PorterSkeletonInterface<any> });

    const skeleton = new Skeleton(projectPath, skeletonPath);

    skeleton.synchronizeDependencies();

    await Promise.all([
      // run `yarn` once more to install the synced dependencies and also the tool
      spawn(`yarn`, ...commonArgs, "add", skeleton.tool),
      // while yarn is running, synchronize the rest of the assets
      Promise.resolve(skeleton.synchronizeFiles().synchronizeScripts()),
    ]);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  // tidying up

  console.log();
  console.log(`🧹 Running cleanup...`);
  console.log();

  try {
    await spawnSilent(`yarn`, ...commonArgs, "sort-package-json");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  console.log(`🥊 Done.`);
}

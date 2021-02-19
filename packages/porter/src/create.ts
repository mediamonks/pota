import path from "path";
import mkdirp from "mkdirp";
import validatePackageName from "validate-npm-package-name";
import kleur from "kleur";

import { spawn, command, spawnSilent } from "@mediamonks/porter-dev-utils/misc";
import { clear } from "@mediamonks/porter-dev-utils/cli";
import type { SkeletonType } from "@mediamonks/porter-dev-utils/types";
import {
  CLI_DEPENDENCY,
  createSkeletonDependency,
  createToolDependency,
  AVAILABLE_SKELETONS,
  SKELETON_TOOL_MAP,
} from "@mediamonks/porter-dev-utils/config";
import { resolveUser } from "@mediamonks/porter-dev-utils/fs";

function validateSkeleton(skeleton: string) {
  if (!AVAILABLE_SKELETONS.includes(skeleton as SkeletonType)) {
    console.error(kleur.red(`'${kleur.yellow}' is not a supported skeleton`));
    process.exit(1);
  }
}

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

export async function create(_skeletonType: string, projectPath: string) {
  // normalize the path
  projectPath = resolveUser(path.normalize(projectPath));

  const projectName = path.basename(projectPath);

  // perform validation
  validateSkeleton(_skeletonType);
  const skeletonType = _skeletonType as SkeletonType;

  validateProjectName(projectName);

  clear();

  console.log(`🏭 Creating ${kleur.green(projectName)}`);

  console.log(`🌊 Using ${kleur.yellow(projectPath)} as the project path`);

  // initialize git repo

  try {
    // create the project's directory
    mkdirp.sync(projectPath);
    command(`git --git-dir=${projectPath}/.git init`);
  } catch (error) {
    console.log("failed initializing git repo", error);
    process.exit(1);
  }

  console.log(`📒 Initialized git repository.`);

  console.log();
  console.log(
    `🔋 Installing ${kleur.yellow(skeletonType)} skeleton dependencies. This might take a while...`
  );

  const skeletonDependency = createSkeletonDependency(skeletonType);
  const toolDependency = createToolDependency(SKELETON_TOOL_MAP[skeletonType]);

  // make sure the current working directory is the projects' path
  const commonArgs = ["--cwd", projectPath];

  try {
    // initialize project using `yarn`
    await spawnSilent(`yarn`, ...commonArgs, "init", "-y", "-s");

    // add `skeleton` and `tools` dependencies
    await spawn(`yarn`, ...commonArgs, "add", CLI_DEPENDENCY, skeletonDependency, toolDependency);
  } catch (error) {
    console.error(error);
    return process.exit(1);
  }

  // perform skeleton synchronizations

  console.log();
  console.log(`💫 Synchronizing the skeleton...`);
  console.log();

  try {
    const { syncFiles, syncDependencies, syncScripts } = await import(
      path.join(projectPath, "node_modules", skeletonDependency, "porter.ts")
    );

    syncFiles?.(projectPath);
    syncDependencies?.(projectPath);
    syncScripts?.(projectPath);

    // run `yarn` once more to install the synced dependencies
    await spawn(`yarn`, ...commonArgs);
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

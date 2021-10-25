import { promises } from "fs";

import sade from "sade";
import * as fs from "@pota/shared/fs";

import { isSkeletonShorthand, getSkeletonFromShorthand, POTA_CLI } from "./config.js";
import * as helpers from "./helpers.js";
import sync from "./sync.js";
import { SPINNER } from "./spinner.js";
import kleur from "kleur";
import { relative, basename } from "path";

const { rm, mkdir } = promises;
const { clear, log } = helpers;
const { red, green, cyan } = kleur;

type SadeSkeleton = string;
type SadeDirectory = string;
interface SadeOptions { 'fail-cleanup': boolean };

sade("@pota/create <skeleton> <dir>", true)
  .describe("Create Pota project")
  .option('--fail-cleanup', 'Cleanup after failing initialization', true)
  .example("npx @pota/create webpack ./project-directory")
  .action(async (skeleton: SadeSkeleton, dir: SadeDirectory, options: SadeOptions) => {

    /**
     * Validation
     */

    SPINNER.start("Validating directory availability...");

    if (!(await fs.isDirectoryAvailable(dir))) {
      console.error(`${green(dir)} already exists, please specify a different directory`);

      process.exit(1);
    }

    SPINNER.succeed();

    SPINNER.start("Validating skeleton package...");

    if (!(helpers.isValidSkeleton(skeleton))) {
      console.error(`${green(skeleton)} is not a valid skeleton package`);

      process.exit(1);
    }

    SPINNER.succeed();

    /**
     * Post-validation, initialization of utilities
     */
    let isFileSkeleton = false;

    const cwd = fs.resolveUser(dir);

    if (helpers.isFileSkeleton(skeleton)) {
      isFileSkeleton = true;
      skeleton = relative(cwd, skeleton);
    } else if (isSkeletonShorthand(skeleton)) skeleton = getSkeletonFromShorthand(skeleton);

    const install = helpers.createInstaller({ cwd });
    const installDev = helpers.createInstaller({ cwd, dev: true });

    async function bail() {
      if (options["fail-cleanup"]) {
        try {
          console.log();
          console.error("Deleting created directory.");
          await rm(cwd, { recursive: true });
        } catch { }
      }

      process.exit(1);
    }

    /**
     * Project creation
     */

    clear();

    SPINNER.start("Creating directory");

    try {
      await mkdir(cwd, { recursive: true });
    } catch (error) {
      SPINNER.fail();
      console.error(error);

      await bail();
    }

    SPINNER.succeed();

    // change directory into current working directory (the project directory)
    process.chdir(cwd);

    SPINNER.start("Initializing git");

    try {
      await helpers.command(`git init`);
    } catch (error) {
      SPINNER.fail();
      console.error(error);

      await bail();
    }

    SPINNER.succeed();

    const visualName = isFileSkeleton ? basename(skeleton) : skeleton;

    SPINNER.start(`Installing ${cyan(visualName)} and ${cyan(POTA_CLI)}, this might take a while...`);

    try {
      await installDev(skeleton, POTA_CLI);
    } catch (error) {
      SPINNER.fail();
      console.error(error);

      await bail();
    }

    try {
      skeleton = await helpers.getSkeletonName(skeleton, cwd);
    } catch (error) {
      SPINNER.fail(`An Error occured reading the project ${green("package.json")}`);
      console.error(error);

      await bail();
    }

    SPINNER.succeed();

    SPINNER.start(`Syncing...`);

    try {
      await sync(cwd, skeleton);
    } catch (error) {
      SPINNER.fail();
      console.error(error);

      await bail();
    }

    SPINNER.succeed();

    let failed = false;

    SPINNER.start(`Installing remaining dependencies...`);

    try {
      await install();
      SPINNER.succeed();
    } catch (error) {
      SPINNER.fail();
      console.error(error);

      failed = true;
    }

    SPINNER.stop();

    log(`🥊 Done${failed ? red(`, but with errors 😥`) : ""}`);

    process.exit(0);
  })
  .parse(process.argv);

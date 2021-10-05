import { promises } from "fs";
import { relative, join } from "path";
import sade from "sade";
import ora from "ora";

import * as helpers from "./helpers.js";
import * as config from "./config.js";
import * as object from "./object.js";
import * as fs from "./fs.js";

const { stderr, exit } = process;
const { rm, mkdir } = promises;
const { clear, log } = helpers;

const SPINNER = ora("Creating a Pota Project");

sade("@pota/create <skeleton> <dir>", true)
  .describe("Create Pota project")
  .example("npx @pota webpack ./project-directory")
  .action(async (skeleton, dir) => {
    // validation

    SPINNER.color = "green";
    SPINNER.start("Validating directory availability...");

    if (!(await fs.isDirectoryAvailable(dir))) {
      stderr.write(`"${dir}" already exists, please specify a different directory`);
      stderr.write("\n");

      exit(1);
    }

    SPINNER.succeed();

    SPINNER.start("Validating skeleton package...");

    if (!(await helpers.isValidSkeleton(skeleton))) {
      stderr.write(`"${skeleton}" is not a valid skeleton package`);
      stderr.write("\n");

      exit(1);
    }

    SPINNER.succeed();

    if (config.isSkeletonShorthand(skeleton)) {
      skeleton = config.getSkeletonFromShorthand(skeleton);
    }

    const initialCwd = fs.getCWD();
    const cwd = fs.resolveUser(dir);
    const relativeCwd = relative(initialCwd, cwd);

    const install = helpers.createInstaller({ cwd });
    const installDev = helpers.createInstaller({ cwd, dev: true });

    // banner
    clear();

    async function bail() {
      try {
        stderr.write("\n");
        stderr.write("Deleting created directory.");
        await rm(cwd);
      } catch {}

      exit(1);
    }

    SPINNER.color = "yellow";
    SPINNER.start("Creating directory");

    try {
      await mkdir(cwd, { recursive: true });
    } catch {
      stderr.write(`An Error occured trying to create a directory on '${relativeCwd}'`);
      stderr.write("\n");

      await bail();
    }

    SPINNER.succeed();

    // change directory into current working directory (the project directory)
    process.chdir(cwd);

    SPINNER.start("Initializing git");

    try {
      await helpers.command(`git init`);
    } catch (error) {
      stderr.write(`An Error occured initializing "git":`);
      stderr.write("\n");
      stderr.write(String(error));
      stderr.write("\n");

      await bail();
    }

    SPINNER.succeed();

    SPINNER.start(`Installing '${skeleton}', this might take a while...`);

    try {
      await installDev(skeleton);
    } catch (error) {
      stderr.write(`An Error occured installing skeleton '${skeleton}':`);
      stderr.write("\n");
      stderr.write(String(error));
      stderr.write("\n");

      await bail();
    }
    SPINNER.succeed();

    let skeletonName: string | null;

    try {
      skeletonName = await helpers.getSkeletonName(skeleton, cwd);
    } catch (error) {
      stderr.write(`An Error occured reading the new package.json:`);
      stderr.write("\n");
      stderr.write(String(error));
      stderr.write("\n");

      await bail();
    }

    const modulesPath = join(cwd, "node_modules");
    const skeletonPath = join(modulesPath, skeletonName!);

    // sync files

    SPINNER.start(`Reading '${config.POTA_CONFIG_FILE}'`);
    const potaConfig = await fs.readPotaConfig(skeletonPath);
    SPINNER.succeed();

    const { transformFiles } = potaConfig;
    let { excludedFiles = [] } = potaConfig;

    excludedFiles = [...excludedFiles, ...config.DEFAULT_EXCLUDED_FILES];

    const fileOptions = { transformFiles, exclude: excludedFiles };

    SPINNER.start(`Copying skeleton files...`);

    try {
      await fs.synchronizeFiles(skeletonPath, cwd, fileOptions);
    } catch (error) {
      stderr.write(`An Error occured copying skeleton files:`);
      stderr.write("\n");
      stderr.write(String(error));
      stderr.write("\n");

      await bail();
    }

    SPINNER.succeed();

    // sync "package.json"
    //
    SPINNER.start(`Reading project '${config.PACKAGE_JSON_FILE}'`);

    try {
      let projectJson = await fs.readPackageJson(cwd);
      SPINNER.succeed();

      // save the `devDependencies` as they contain the skeleton package
      const oldDevDependencies = { ...(projectJson.devDependencies ?? {}) };

      SPINNER.start(`Reading skeleton '${config.PACKAGE_JSON_FILE}'`);
      const skeletonJson = await fs.readPackageJson(skeletonPath);
      SPINNER.succeed();

      SPINNER.start(`Reading '${config.POTA_PACKAGE_JSON_FILE}'`);
      const potaJson = await fs.readPackageJson(skeletonPath, true);
      SPINNER.succeed();

      projectJson = { ...projectJson, ...potaJson };
      projectJson.devDependencies = { ...oldDevDependencies, ...projectJson.devDependencies };

      const getPath = () => object.getPathToValue(config.REPLACE_MARK, projectJson);

      let pathToTag = getPath();

      while (pathToTag != null) {
        // get value from the skeleton's "package.json"
        const skeletonValue = object.getValueForPath(pathToTag, skeletonJson);

        // update the project "package.json" with the new value
        object.setValueForPath(skeletonValue || config.UNDEFINED_MARK, pathToTag, projectJson);

        // get the path to the next "<>" field
        pathToTag = getPath();
      }

      SPINNER.start(`Writing project '${config.PACKAGE_JSON_FILE}'`);

      await fs.writePackageJson(projectJson, cwd);
    } catch {
      await bail();
    }

    SPINNER.succeed();

    SPINNER.start(`Installing project dependencies...`);

    let failed = false;

    try {
      await install();
      SPINNER.succeed();
    } catch (error) {
      failed = true;

      SPINNER.fail();

      stderr.write("\n");
      stderr.write(String(error));
      stderr.write("\n");
    }

    SPINNER.stop();

    log(`🥊 Done${failed ? `, but with errors 😥` : ""}`);
  })
  .parse(process.argv);

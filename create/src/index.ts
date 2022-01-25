import { relative, basename, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { access, mkdir } from 'fs/promises';

import npa from 'npm-package-arg';
import sade from 'sade';
import kleur from 'kleur';
// @ts-ignore TypeScript is being weird
import dedent from 'dedent';

import { isSkeletonShorthand, getSkeletonFromShorthand } from './config.js';
import * as helpers from './helpers.js';
import sync, { addScripts } from './sync.js';
import { initializeGit } from './git.js';

const { log } = helpers;
const { green, cyan } = kleur;

type SadeSkeleton = string;
type SadeDirectory = string;
interface SadeOptions {
  'fail-cleanup': boolean;
  'pota-dot-dir': boolean;
  'add-pota-cli': boolean;
  'init-git': boolean;
}

const selfPackageJsonPath = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'package.json');

sade('@pota/create <skeleton> <dir>', true)
  .version((await helpers.readPackageJson(selfPackageJsonPath)).version ?? 'N/A')
  .describe('Create Pota project')
  .option('--fail-cleanup', 'Cleanup after failing initialization', true)
  .option('--pota-dot-dir', "Adds the '.pota' directory in the project", true)
  .option('--init-git', 'Initializes git in the created project', true)
  .option(
    '--add-pota-cli',
    "Adds the '@pota/cli' dependency and skeleton commands as scripts",
    true,
  )
  .example('npx @pota/create webpack ./project-directory')
  .action(async (skeleton: SadeSkeleton, dir: SadeDirectory, options: SadeOptions) => {
    const projectName = basename(dir);
    const originalCwd = process.cwd();
    const cwd = resolve(process.cwd(), dir);

    log(`Creating a new Pota App ${cyan(projectName)} in ${green(cwd)}.`);

    // resolve shorthand to full package name
    if (isSkeletonShorthand(skeleton)) skeleton = getSkeletonFromShorthand(skeleton);

    // parse the skeleton package
    let skeletonPkgDetails: npa.Result;

    try {
      skeletonPkgDetails = npa(skeleton);
    } catch (error) {
      console.error(`${green(skeleton)} is not a valid skeleton package`);

      process.exit(1);
    }

    // check if directory is available
    try {
      await access(cwd);

      console.error(`${green(cwd)} already exists, please specify a different directory`);

      process.exit(1);
    } catch {}

    if (skeletonPkgDetails.type === 'file' || skeletonPkgDetails.type === 'directory') {
      skeleton = relative(cwd, skeleton);
      skeletonPkgDetails = npa(skeleton);
    }

    const bail = helpers.createBailer(options['fail-cleanup'] ? cwd : undefined);

    let postCreate: string | undefined = undefined;

    try {
      // create project directory
      await mkdir(cwd, { recursive: true });

      // change directory into current working directory (the project directory)
      process.chdir(cwd);

      // write the initial package.json with just the project name
      // to make sure that the latter `npm install`'s will will install into the correct directory
      await helpers.writePackageJson({ name: projectName }, cwd);

      const visualName = skeletonPkgDetails.type === 'file' ? basename(skeleton) : skeleton;

      if (options['add-pota-cli']) {
        log(`Installing ${cyan(visualName)} and ${cyan('@pota/cli')}, this might take a while...`);
      } else log(`Installing ${cyan(visualName)}, this might take a while...`);
      log();

      await helpers.spawn(
        'npm',
        'install',
        skeleton,
        options['add-pota-cli'] ? '@pota/cli' : '',
        '-D',
        '--no-audit',
        '--no-fund',
      );

      log();
      console.log(`Setting up project structure...`);

      const syncResult = await sync(cwd, await helpers.getSkeletonName(skeletonPkgDetails, cwd), {
        potaDir: options['pota-dot-dir'],
        addCLI: options['add-pota-cli'],
      });

      ({ postCreate } = syncResult);
      const { afterInstallScripts } = syncResult;

      console.log(`Installing remaining peer dependencies...`);

      await helpers.spawn('npm', 'install', '--no-audit', '--no-fund', '--prefer-offline');

      await addScripts(cwd, afterInstallScripts);
    } catch (error) {
      console.error(error);

      await bail();
    }

    try {
      if (options['init-git'] && (await initializeGit())) {
        log('Initialized a git repository.');
        log();
      }
    } catch (error) {
      console.error(error);
    }

    if (postCreate) {
      console.log(`Running post-create script '${cyan(postCreate)}'...`);

      const [command, ...args] = postCreate.split(' ');
      await helpers.spawn(command, ...args);
    }

    // TODO: include the commands of the skeleton instead of assuming that every skeleton comes with `build` and `dev`
    log(dedent`
        🚀🚀🚀 ${green('SUCCESS')} 🚀🚀🚀
        Created ${cyan(projectName)} in ${green(cwd)}

        Inside that directory, you can run several commands:

          ${cyan(`npm run dev`)}
            Starts the development server.

          ${cyan(`npm run build`)}
            Builds the app for production.

        We suggest that you begin by typing:

          ${cyan('cd')} ${relative(originalCwd, cwd)}
          ${cyan(`npm run dev`)}


        `);

    process.exit(0);
  })
  .parse(process.argv);

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
import sync from './sync.js';

const { log } = helpers;
const { green, cyan } = kleur;

type SadeSkeleton = string;
type SadeDirectory = string;
interface SadeOptions {
  'fail-cleanup': boolean;
  'pota-dot-dir': boolean;
  'add-pota-cli': boolean;
}

const selfPackageJsonPath = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'package.json');

sade('@pota/create <skeleton> <dir>', true)
  .version((await helpers.readPackageJson(selfPackageJsonPath)).version ?? 'N/A')
  .describe('Create Pota project')
  .option('--fail-cleanup', 'Cleanup after failing initialization', true)
  .option('--pota-dot-dir', "Adds the '.pota' directory in the project", true)
  .option(
    '--add-pota-cli',
    "Adds the '@pota/cli' dependency and skeleton commands as scripts",
    true,
  )
  .example('npx @pota/create webpack ./project-directory')
  .action(async (skeleton: SadeSkeleton, dir: SadeDirectory, options: SadeOptions) => {
    const pkgName = basename(dir);
    const originalCwd = process.cwd();
    const cwd = resolve(process.cwd(), dir);

    log(`Creating a new Pota App ${cyan(pkgName)} in ${green(cwd)}.`);

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

    if (skeletonPkgDetails.type === 'file') {
      skeleton = relative(cwd, skeleton);
      skeletonPkgDetails = npa(skeleton);
    }

    const bail = helpers.createBailer(options['fail-cleanup'] ? cwd : undefined);

    try {
      // create project directory
      await mkdir(cwd, { recursive: true });

      // change directory into current working directory (the project directory)
      process.chdir(cwd);

      const visualName = skeletonPkgDetails.type === 'file' ? basename(skeleton) : skeleton;

      if (options['add-pota-cli'])
        log(`Installing ${cyan(visualName)} and ${cyan('@pota/cli')}, this might take a while...`);
      else log(`Installing ${cyan(visualName)}, this might take a while...`);
      log();

      await helpers.spawn(
        'npm',
        'install',
        skeleton,
        options['add-pota-cli'] ? '@pota/cli' : '',
        `--prefix ${cwd}`,
        '-D',
        '--no-audit',
        '--no-fund',
      );

      log();
      console.log(`Setting up project structure...`);

      await sync(cwd, await helpers.getSkeletonName(skeletonPkgDetails, cwd), pkgName, {
        potaDir: options['pota-dot-dir'],
        addCLI: options['add-pota-cli'],
      });

      console.log(`Installing remaining peer dependencies...`);

      await helpers.spawn(
        'npm',
        'install',
        `--prefix ${cwd}`,
        '--no-audit',
        '--no-fund',
        '--prefer-offline',
      );
    } catch (error) {
      console.error(error);

      await bail();
    }

    let initializedGit = false;

    try {
      // create branch under the name `main` and create initial commit
      try {
        await helpers.command('git init -b main');
        await helpers.command('git add .');
        await helpers.command('git commit -m "Initial commit from @pota/create"');
        initializedGit = true;
      } catch (error) {
        // if `-b main` isn't supported fallback to renaming the branch
        if ((error as { code: number }).code === 129) {
          await helpers.command('git init');
          await helpers.command('git add .');
          await helpers.command('git commit -m "Initial commit from @pota/create"');
          await helpers.command('git branch master -m main');
          initializedGit = true;
        } else throw error;
      }
    } catch (error) {
      console.error(error);
    }

    // TODO: include the commands of the skeleton instead of assuming that every skeleton comes with `build` and `dev`
    log();
    if (initializedGit) {
      log('Initialized a git repository.');
      log();
    }
    log(dedent`
        🚀🚀🚀 ${green('SUCCESS')} 🚀🚀🚀
        Created ${cyan(pkgName)} at ${green(cwd)}

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

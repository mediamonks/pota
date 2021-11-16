import { relative, basename } from 'path';

import npa from 'npm-package-arg';
import sade from 'sade';
import kleur from 'kleur';
// @ts-ignore TypeScript is being weird
import dedent from 'dedent';
import { resolveUser } from '@pota/shared/fs';

import { isSkeletonShorthand, getSkeletonFromShorthand } from './config.js';
import * as helpers from './helpers.js';
import sync from './sync.js';

const { log } = helpers;
const { green, cyan } = kleur;

type SadeSkeleton = string;
type SadeDirectory = string;
interface SadeOptions {
  'fail-cleanup': boolean;
}

sade('@pota/create <skeleton> <dir>', true)
  .describe('Create Pota project')
  .option('--fail-cleanup', 'Cleanup after failing initialization', true)
  .example('npx @pota/create webpack ./project-directory')
  .action(async (skeleton: SadeSkeleton, dir: SadeDirectory, options: SadeOptions) => {
    const pkgName = basename(dir);
    const originalCwd = resolveUser();
    const cwd = resolveUser(dir);

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

    if (skeletonPkgDetails.type === 'file') {
      skeleton = relative(cwd, skeleton);
      skeletonPkgDetails = npa(skeleton);
    }

    const bail = helpers.createBailer(options['fail-cleanup'] ? cwd : undefined);

    try {
      // create project directory
      await helpers.createDir(cwd);

      // change directory into current working directory (the project directory)
      process.chdir(cwd);

      const visualName = skeletonPkgDetails.type === 'file' ? basename(skeleton) : skeleton;

      log(`Installing ${cyan(visualName)}, this might take a while...`);
      log();

      await helpers.spawn(
        'npm',
        'install',
        skeleton,
        `--prefix ${cwd}`,
        '-D',
        '--no-audit',
        '--no-fund',
      );

      log();
      console.log(`Setting up project structure...`);

      await sync(cwd, await helpers.getSkeletonName(skeletonPkgDetails, cwd), pkgName);

      console.log(`Installing remaining peer dependencies...`);

      await helpers.spawn(
        'npm',
        'install',
        `--prefix ${cwd}`,
        '--no-audit',
        '--no-fund',
        '--prefer-offline',
      );

      // create branch under the name `main` and create initial commit
      try {
        await helpers.command('git init -b main');
        await helpers.command('git add .');
        await helpers.command('git commit -m "Initial commit from @pota/create"');
      } catch (error) {
        // if `-b main` isn't supported fallback to renaming the branch
        if ((error as { code: number }).code === 129) {
          await helpers.command('git init');
          await helpers.command('git add .');
          await helpers.command('git commit -m "Initial commit from @pota/create"');
          await helpers.command('git branch master -m main');
        } else throw error;
      }
    } catch (error) {
      console.error(error);

      await bail();
    }

    // TODO: include the commands of the skeleton instead of assuming that every skeleton comes with `build` and `dev`
    log();
    log(dedent`
        Initialized a git repository.

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

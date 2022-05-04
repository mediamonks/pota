import { resolve, relative } from 'path';
import { mkdir } from 'fs/promises';

import ora, { Ora } from 'ora';
// @ts-ignore cannot find ts definitions for kleur, even though there are there...
import kleur from 'kleur';

import { promptName } from './prompts/name.js';
import { promptTemplate } from './prompts/template.js';
import { promptScripts } from './prompts/scripts.js';
import { promptGit } from './prompts/git.js';
import { command } from './util/spawn.js';
import {
  getPackageInfo,
  isFilePackage,
  isRegistryPackage,
  readPackageJson,
  ScriptsPackageJson,
  TemplatePackageJson,
  writePackageJson,
  IGNORED_PACKAGE_KEYS,
} from './package.js';
import { downloadTemplate } from './downloadTemplate.js';
import args from './args.js';

const { bold, green, cyan, yellow } = kleur;

let SPINNER: Ora;

// cwd will change in the exection of this script
// so we need to make sure we are always using the same value
// when referencing this variable
const CWD = process.cwd();

// prefetch the data required for the `promptTemplate`
let isPrefetching = true;
const prefetchPromise = args.template
  ? Promise.resolve()
  : promptTemplate.prefetch({ keyword: '@pota', scopes: ['pota'] }).finally(() => {
      isPrefetching = false;
    });

// prompt the project name
const name = args.name || (await promptName(CWD));

// create the project path
const projectPath = resolve(CWD, name);

// create project directory
await mkdir(projectPath);

// change cwd to project directory
process.chdir(projectPath);

// if the `promptTemplate` prefetch hasn't finished,
// then inform the user and await it
if (isPrefetching) {
  SPINNER = ora();
  SPINNER.start(`retrieving available templates`);
  await prefetchPromise;
  SPINNER.stop();
}

// prompt for a template
const template = args.template || (await promptTemplate());

// initiate the downloading the template package
let isDownloadingTemplate = true;
const downloadTemplatePromise = downloadTemplate(template, CWD).finally(() => {
  isDownloadingTemplate = false;
});

const scripts =
  args.scripts && Object.keys(args.scripts).length > 0
    ? { ...args.scripts }
    : isRegistryPackage(template)
    ? await (async () => {
        SPINNER ??= ora();
        SPINNER.start(`retrieving ${yellow(template)} metadata`);

        // retrieve the `pota.scripts` metadata of the selected template package
        const templatePota = (await getPackageInfo(template, 'create-pota.scripts')) as NonNullable<
          NonNullable<TemplatePackageJson['create-pota']>['scripts']
        >;

        SPINNER.succeed();

        return await promptScripts(templatePota);
      })()
    : {};

const git = typeof args.git === 'undefined' ? await promptGit() : args.git;

// if by this point we have not finished downloading the template
// then inform the user and await it
if (isDownloadingTemplate) {
  SPINNER ??= ora();
  SPINNER.start(`downloading ${yellow(template)}`);
  await downloadTemplatePromise;
  SPINNER.succeed();
}

const potaField: Array<string> = [];
const devDependenciesField: Record<string, string> = {};

if (Object.keys(scripts).length > 0) {
  SPINNER ??= ora();
  SPINNER.start(`retrieving scripts metadata`);

  // retrieve the correct version for all selected scripts
  await Promise.all(
    Object.values(scripts).map(async (pkg) => {
      if (isFilePackage(pkg)) return;

      let version = null;

      try {
        version = (await getPackageInfo(pkg, 'dist-tags.latest')) as string;
      } catch {}

      devDependenciesField[pkg] = version ? `~${version}` : 'latest';

      potaField.push(pkg);
    }),
  );

  SPINNER.succeed();
}

// read the download tempate's package.json
const templatePkg = await readPackageJson(projectPath);

// delete keys that we don't care about from the template pkg
for (const k in templatePkg) {
  const key = k as keyof typeof templatePkg;
  if (IGNORED_PACKAGE_KEYS.includes(key)) delete templatePkg[key];
}

// insert the scripts dev dependencies into the template dev dependencies
if (Object.entries(devDependenciesField).length > 0) {
  templatePkg.devDependencies ??= {};
  templatePkg.devDependencies = { ...templatePkg.devDependencies, ...devDependenciesField };
}
// add pota field
if (potaField.length > 0) {
  templatePkg.pota ??= [];
  templatePkg.pota = [...templatePkg.pota, ...potaField];
}

// write back the final package.json
await writePackageJson(projectPath, {
  name,
  private: true,
  version: '1.0.0',
  ...templatePkg,
});

// initialize git
if (git) {
  SPINNER ??= ora();
  SPINNER.start('initializing git');
  try {
    await command('git init -b main');
    SPINNER.succeed();
  } catch (error) {
    // if `-b main` isn't supported fallback to renaming the branch
    if ((error as { code: number }).code === 129) {
      await command('git init');
      await command('git branch master -m main');
      SPINNER.succeed();
    } else SPINNER.fail();
  }
}

// retrieve the bundler scripts `pota` field
let commandsRecord: NonNullable<ScriptsPackageJson['create-pota']>['commands'] = {};

if (scripts.builders) {
  try {
    commandsRecord = (await getPackageInfo(
      scripts.builders,
      'create-pota.commands',
    )) as NonNullable<ScriptsPackageJson['create-pota']>['commands'];
  } catch {}
}

const commands = Object.entries(commandsRecord);

const suggestedCommand = commands.find(([, spec]) => spec.suggest)?.[0];

console.log();
console.log(`Created ${bold(name)} 💁 ${green(projectPath)}`);
console.log();
if (scripts.builders) {
  if (commands.length > 0) {
    console.log(`${yellow(scripts.builders)} provides the following commands:`);
    console.log();
    for (const [command, spec] of commands) {
      console.log(`  ${cyan(`npm run ${command}`)}`);
      if (spec.description) console.log(`    ${spec.description}`);
      console.log();
    }
  } else {
    console.log(`scripts:  ${yellow(scripts.builders)}`);
    console.log();
  }
}
console.log('We suggest that you begin by typing:');
console.log();
console.log(`    ${cyan('cd')} ${relative(CWD, process.cwd())}`);
console.log(`    ${cyan('npm install')}`);
if (suggestedCommand) console.log(`    ${cyan(`npm run ${suggestedCommand}`)}`);

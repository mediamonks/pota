import { join } from 'path';
import { access, mkdir, unlink as removeFile } from 'fs/promises';

// @ts-ignore TS is drunk, AGAIN!
import kleur from 'kleur';
import prompts from 'prompts';

import { copy, Recursive } from './fs.js';
import { isString } from './predicates.js';
import { nameValidator } from './validators.js';
import { resolve, relative } from 'path';
import { spawn, command } from './spawn.js';
import {
  normalizePackageName,
  PackageJsonShapeKey,
  readPackageJson,
  writePackageJson,
} from './package.js';
import {
  CUSTOM_CHOICE_VALUE,
  FILE_RENAMES,
  IGNORED_FILES,
  IGNORED_PACKAGE_KEYS,
  NONE_CHOICE,
  OFFICIAL_SCRIPTS,
  OFFICIAL_TEMPLATES,
  TEMPLATE_VALUES_AS_KEYS,
} from './constants.js';
import { parseArguments } from './parseArguments.js';

const { green, cyan, yellow, gray } = kleur;

// override prompts with passed args (if any)
prompts.override(parseArguments(process.argv.slice(2)));

// cwd will change in the exection of this script
// so we need to make sure we are always using the same value
// when referencing this variable
const CWD = process.cwd();

const PROMPTS: Array<prompts.PromptObject<'name' | 'template' | 'scripts' | 'git'>> = [
  // query project name
  {
    type: 'text',
    name: 'name',
    message: 'Type in your project name:',
    initial: 'pota-project',
    async validate(name) {
      const nameOkorError = nameValidator(name);

      if (typeof nameOkorError === 'string') return nameOkorError;

      try {
        await access(resolve(CWD, name));
        return `The directory of the specified name already exists.`;
      } catch {
        return true;
      }
    },
  },
  // query for template
  {
    type: 'select',
    name: 'template',
    message: 'Select a template:',
    initial: 0,
    choices: [
      ...Object.entries(OFFICIAL_TEMPLATES).map(([title, { value }]) => ({ title, value })),
      {
        title: yellow(CUSTOM_CHOICE_VALUE),
        value: CUSTOM_CHOICE_VALUE,
        description: `bring your own custom template`,
      },
    ],
  },
  // custom choice: query for template
  {
    type: (prev) => (prev === CUSTOM_CHOICE_VALUE ? 'text' : null),
    name: 'template',
    message: 'Custom template package:',
    validate: nameValidator,
  },
  // query for scripts
  {
    type: 'select',
    name: 'scripts',
    message: 'Select a scripts package:',
    initial: 0,
    choices(prev: string) {
      const { recommended = [] as ReadonlyArray<string> } =
        OFFICIAL_TEMPLATES[TEMPLATE_VALUES_AS_KEYS[prev] as keyof typeof OFFICIAL_TEMPLATES] ?? {};

      return [
        ...Object.entries(OFFICIAL_SCRIPTS).map(([title, value]) => {
          if (recommended.length > 0 && !recommended.includes(value)) {
            return { value, title: gray(title), description: 'not tested with selected template' };
          }
          return { title, value, description: 'recommended' };
        }),
        {
          title: yellow(CUSTOM_CHOICE_VALUE),
          value: CUSTOM_CHOICE_VALUE,
          description: `bring your own custom script`,
        },
        NONE_CHOICE,
      ];
    },
  },
  // custom choice: query for scripts
  {
    type: (prev) => (prev === CUSTOM_CHOICE_VALUE ? 'text' : null),
    name: 'scripts',
    message: 'Custom script package:',
    validate: nameValidator,
  },
  // query if the user wants git initialized in the project
  {
    type: 'toggle',
    name: 'git',
    message: 'Do you want to initialize git in the project directory?',
    initial: true,
    active: 'yes',
    inactive: 'no',
  },
];

// prompt the user
const result = await prompts(PROMPTS, {
  onCancel() {
    throw new Error('Cancelled.');
  },
}).catch((error) => {
  console.warn((error as Error).message);
  process.exit(1);
});

// get project name
const { name } = result;

// setup project path
const projectPath = resolve(CWD, name);

let scriptsPackage =
  result.scripts === NONE_CHOICE.value
    ? null
    : normalizePackageName(result.scripts as string, CWD, projectPath);

// normalize template package names (resolve file paths)
let templatePackage = normalizePackageName(result.template as string, CWD, projectPath);

// create project directory
await mkdir(projectPath);

// change cwd to project directory
process.chdir(projectPath);

// create the initial package.json with just the project name
await writePackageJson(projectPath, { name });

// TODO: immediately copy template if its a local package

// install the template package
try {
  await spawn(
    'npm',
    'install',
    templatePackage,
    '--save-dev',
    '--ignore-scripts',
    '--force', // we only care about the content of the template package, so if its dependencies end up faulty, then that is fine
    '--no-fund',
    '--no-audit',
    '--quiet',
  );
} catch (error) {
  console.error((error as Error).message || error);
  console.error(`Error occurred fetching '${templatePackage}'`);
  process.exit(1);
}
console.log();

// read the newly created package json
// (should now contain the name and 1-2 dev dependencies for the template and scripts packages)
const pkg = await readPackageJson(projectPath);

// remove the package-lock (should contains a single entry for the template package)
await removeFile(join(projectPath, 'package-lock.json'));

// convert the template package specifier to the package names
// Example: `../template/muban` to `@pota/muban-template`
if (templatePackage.isFilenamePackage || templatePackage.isGitPackage) {
  const matchingEntry = Object.entries(pkg.devDependencies ?? ({} as Record<string, string>)).find(
    ([, pkgSpec]) => pkgSpec.endsWith(templatePackage),
  );

  if (matchingEntry) {
    [templatePackage] = matchingEntry;
  } else {
    console.error(`Error occurred discovering '${templatePackage}'.`);
    process.exit(1);
  }
}

const templatePackagePath = resolve(projectPath, 'node_modules', templatePackage);

for (let file of await Recursive.readdir(templatePackagePath, ['node_modules'])) {
  if (IGNORED_FILES.includes(file)) continue;

  const src = resolve(templatePackagePath, file);

  if (file in FILE_RENAMES) file = FILE_RENAMES[file as keyof typeof FILE_RENAMES];
  const dst = resolve(projectPath, file);

  await copy(src, dst);
}

// read the template package.json
const templatePkg = await readPackageJson(templatePackagePath);

const templatePkgPotaConfig =
  templatePkg.pota && !isString(templatePkg.pota) ? templatePkg.pota : {};

delete pkg.devDependencies![templatePackage];

// delete keys that we don't care about from the template pkg
for (const key in templatePkg) {
  if (IGNORED_PACKAGE_KEYS.includes(key as PackageJsonShapeKey)) {
    delete templatePkg[key as keyof typeof templatePkg];
  }
}

let scriptsPackageVersion = 'latest';

if (scriptsPackage?.isFilenamePackage) {
  scriptsPackageVersion = scriptsPackage; // version is now the path to the scripts package
  scriptsPackage = (await readPackageJson(String(scriptsPackage))).name!;
}

const dependencies = { ...templatePkg.dependencies, ...templatePkgPotaConfig.dependencies };

const devDependencies = {
  ...pkg.devDependencies,
  ...templatePkg.devDependencies,
  ...templatePkgPotaConfig.devDependencies,
  ...(scriptsPackage && { [scriptsPackage]: scriptsPackageVersion }),
};

if (scriptsPackage) templatePkg.pota = scriptsPackage;
templatePkg.name = name;
templatePkg.version = '1.0.0';

if (Object.keys(dependencies).length > 0) templatePkg.dependencies = dependencies;
if (Object.keys(devDependencies).length > 0) templatePkg.devDependencies = devDependencies;

// write the merged package.json to the project
await writePackageJson(projectPath, templatePkg);

// initialize git
if (result.git) {
  try {
    await command('git init -b main');
  } catch (error) {
    // if `-b main` isn't supported fallback to renaming the branch
    if ((error as { code: number }).code === 129) {
      await command('git init');
      await command('git branch master -m main');
    } else console.warn('Failed to initialize git.');
  }
}

const relativeDir = relative(CWD, process.cwd());

console.log(`  success 💁`);
console.log();
console.log(`  created   ${green(name)}`);
console.log();
console.log(`  template: ${yellow(templatePackage)}`);
if (scriptsPackage) console.log(`  scripts:  ${yellow(scriptsPackage)}`);
console.log();
console.log('  we suggest that you begin by typing:');
console.log();
console.log(`    ${cyan('cd')} ${relativeDir}`);
console.log();
console.log(cyan('    npm install'));

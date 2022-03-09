import { access, mkdir } from 'fs/promises';

// @ts-ignore TS is drunk, AGAIN!
import kleur from 'kleur';
import prompts from 'prompts';

import { nameValidator } from './validators.js';
import { resolve, relative } from 'path';
import { command } from './spawn.js';
import { PackageJsonShape, readPackageJson, writePackageJson } from './package.js';
import {
  CUSTOM_CHOICE_VALUE,
  IGNORED_PACKAGE_KEYS,
  NONE_CHOICE,
  OFFICIAL_SCRIPTS,
  OFFICIAL_TEMPLATES,
  TEMPLATE_VALUES_AS_KEYS,
} from './constants.js';
import { parseArguments } from './parseArguments.js';
import { initFileTemplate, initGitTemplate, initNpmTemplate } from './template.js';

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

const { name, template } = result;

// setup project path
const projectPath = resolve(CWD, name);

let scriptsPackage = result.scripts === NONE_CHOICE.value ? null : result.scripts;
// create project directory
await mkdir(projectPath);

// change cwd to project directory
process.chdir(projectPath);

const IS_WINDOWS = process.platform === 'win32';
const HAS_SLASHES = IS_WINDOWS ? /\\|[/]/ : /[/]/;

const GIT_REGEX = /((git|ssh|http(s)?)|(git@[\w\.]+))(:(\/\/)?)([\w\.@\:/\-~]+)(\.git)(\/)?/;

// install the template package
try {
  if (
    GIT_REGEX.test(result.template) ||
    result.template.startsWith('bitbucket:') ||
    result.template.startsWith('github:')
  ) {
    await initGitTemplate(template);
  } else if (HAS_SLASHES.test(template) && !template.startsWith('@')) {
    await initFileTemplate(resolve(CWD, template));
  } else {
    await initNpmTemplate(template);
  }
} catch (error) {
  console.error(`Error occurred initializing '${template}'`);
  console.error((error as Error).message || error);
  process.exit(1);
}

const finalPkg: PackageJsonShape = {
  name,
  private: true,
  version: '1.0.0',
  ...(scriptsPackage && { pota: scriptsPackage }),
};

const templatePkg = await readPackageJson(projectPath);

// delete keys that we don't care about from the template pkg
for (const k in templatePkg) {
  const key = k as keyof typeof templatePkg;
  if (!IGNORED_PACKAGE_KEYS.includes(key)) {
    (finalPkg as any)[key] = templatePkg[key];
  }
}

if (scriptsPackage) {
  finalPkg.devDependencies ??= {};
  finalPkg.devDependencies[scriptsPackage] = 'latest';
}

await writePackageJson(projectPath, finalPkg);

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
console.log(`  template: ${yellow(template)}`);
if (scriptsPackage) console.log(`  scripts:  ${yellow(scriptsPackage)}`);
console.log();
console.log('  we suggest that you begin by typing:');
console.log();
console.log(`    ${cyan('cd')} ${relativeDir}`);
console.log();
console.log(cyan('    npm install'));

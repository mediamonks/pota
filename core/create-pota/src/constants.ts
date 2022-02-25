import prompts from 'prompts';
// @ts-ignore TS is drunk, AGAIN!
import kleur from 'kleur';

import type { PackageJsonShapeKey } from './package.js';

const { gray } = kleur;

export const OFFICIAL_SCRIPTS = {
  webpack: '@pota/webpack-scripts',
  'muban-webpack': '@pota/muban-webpack-scripts',
  'react-webpack': '@pota/react-webpack-scripts',
} as const;

export type OfficialScripts = keyof typeof OFFICIAL_SCRIPTS;

export const OFFICIAL_TEMPLATES = {
  vanilla: {
    value: '@pota/vanilla-template',
    recommended: [OFFICIAL_SCRIPTS.webpack],
  },
  muban: {
    value: '@pota/muban-template',
    recommended: [OFFICIAL_SCRIPTS['muban-webpack']],
  },
  react: {
    value: '@pota/react-template',
    recommended: [OFFICIAL_SCRIPTS['react-webpack']],
  },
  'react-base': {
    value: '@pota/react-base-template',
    recommended: [OFFICIAL_SCRIPTS['react-webpack']],
  },
} as const;

export type OfficialTemplate = keyof typeof OFFICIAL_TEMPLATES;

export const SHORTHANDS: Record<string, { template: OfficialTemplate; scripts?: OfficialScripts }> =
  {
    muban: { template: 'muban', scripts: 'muban-webpack' },
    vanilla: { template: 'vanilla', scripts: 'webpack' },
    react: { template: 'react', scripts: 'react-webpack' },
    'react-base': { template: 'react-base', scripts: 'react-webpack' },
  };

export const TEMPLATE_VALUES_AS_KEYS = Object.fromEntries(
  Object.entries(OFFICIAL_TEMPLATES).map(([key, { value }]) => [value, key]),
) as Record<string, OfficialTemplate>;

export const CUSTOM_CHOICE_VALUE = 'custom' as const;

export const NONE_CHOICE: prompts.Choice = {
  title: gray('none'),
  value: 'none',
  description: "don't include a scripts package",
};

export const FILE_RENAMES = {
  gitignore: '.gitignore',
};

export const IGNORED_FILES = ['package.json'];

export const IGNORED_PACKAGE_KEYS: ReadonlyArray<PackageJsonShapeKey> = [
  'author',
  'bin',
  'bugs',
  'description',
  'exports',
  'files',
  'license',
  'publishConfig',
  'repository',
];

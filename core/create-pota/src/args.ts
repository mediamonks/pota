import minimist from 'minimist';
import { SelectedScripts } from './prompts/scripts.js';

const COMBINATIONS = {
  muban: { template: '@pota/muban-template', scripts: { builders: '@pota/muban-webpack-scripts' } },
  vanilla: { template: '@pota/vanilla-template', scripts: { builders: '@pota/webpack-scripts' } },
  react: { template: '@pota/react-template', scripts: { builders: '@pota/react-webpack-scripts' } },
  'react-base': {
    template: '@pota/react-base-template',
    scripts: { builders: '@pota/react-webpack-scripts' },
  },
} as const;

const OVERRIDING_ARGUMENTS = new Set(['--git', '--no-git'] as const);

type OverridingArgument = typeof OVERRIDING_ARGUMENTS extends Set<infer T> ? T : never;

let {
  git,
  name,
  template,
  _: [combination],
} = minimist(process.argv.slice(2), {
  string: ['template', 'name'],
  unknown: (arg) => arg in COMBINATIONS || OVERRIDING_ARGUMENTS.has(arg as OverridingArgument),
});

let scripts;

// if a combination has been passed, then apply its `template` and `scripts` back to the args
if (combination) ({ template, scripts } = COMBINATIONS[combination as keyof typeof COMBINATIONS]);

export default { git, name, scripts, template } as {
  git?: boolean;
  name?: string;
  scripts?: SelectedScripts;
  template?: string;
};

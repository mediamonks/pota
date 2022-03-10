import minimist from 'minimist';

import { OFFICIAL_TEMPLATES, OFFICIAL_SCRIPTS, NONE_CHOICE } from './constants.js';
import type { OfficialScripts, OfficialTemplate } from './constants.js';

const COMBINATIONS: Record<string, { template: OfficialTemplate; scripts?: OfficialScripts }> = {
  muban: { template: 'muban', scripts: 'muban-webpack' },
  vanilla: { template: 'vanilla', scripts: 'webpack' },
  react: { template: 'react', scripts: 'react-webpack' },
  'react-base': { template: 'react-base', scripts: 'react-webpack' },
};

const OVERRIDING_ARGUMENTS = new Set(['--template', '--scripts', '--no-scripts'] as const);

type OverridingArgument = typeof OVERRIDING_ARGUMENTS extends Set<infer T> ? T : never;

export function parseArguments(raw: Array<string>): Record<string, string> {
  // parse args and filter out non-combination or override options
  const args = minimist(raw, {
    unknown: (arg) => arg in COMBINATIONS || OVERRIDING_ARGUMENTS.has(arg as OverridingArgument),
  });

  // if a combination has been passed, then apply its `template` and `scripts` back to the args
  const [combination] = args._;

  if (combination) {
    const { template, scripts } = COMBINATIONS[combination];

    args.template = OFFICIAL_TEMPLATES[template].value;
    if (scripts) args.scripts = OFFICIAL_SCRIPTS[scripts];
  }

  if (args['scripts'] === false) args.scripts = NONE_CHOICE.value;

  return args;
}

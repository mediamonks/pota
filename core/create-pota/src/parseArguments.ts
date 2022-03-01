import minimist from 'minimist';
import { OFFICIAL_TEMPLATES, OFFICIAL_SCRIPTS, NONE_CHOICE } from './constants.js';
import type { OfficialScripts, OfficialTemplate } from './constants.js';

const SHORTHANDS: Record<string, { template: OfficialTemplate; scripts?: OfficialScripts }> = {
  muban: { template: 'muban', scripts: 'muban-webpack' },
  vanilla: { template: 'vanilla', scripts: 'webpack' },
  react: { template: 'react', scripts: 'react-webpack' },
  'react-base': { template: 'react-base', scripts: 'react-webpack' },
};

const OVERRIDING_ARGUMENTS = new Set(['--template', '--scripts', '--no-scripts'] as const);

type OverridingArgument = typeof OVERRIDING_ARGUMENTS extends Set<infer T> ? T : never;

export function parseArguments(raw: Array<string>): Record<string, string> {
  // parse args and filter out non-shorthand options
  const args = minimist(raw, {
    unknown: (arg) => arg in SHORTHANDS || OVERRIDING_ARGUMENTS.has(arg as OverridingArgument),
  });

  // if a shorthand has been passed, then apply its `template` and `scripts` back to the args
  const [shorthand] = args._;

  if (shorthand) {
    args.template = OFFICIAL_TEMPLATES[SHORTHANDS[shorthand].template].value;
    if (SHORTHANDS[shorthand].scripts) {
      args.scripts = OFFICIAL_SCRIPTS[SHORTHANDS[shorthand].scripts!];
    }
  }

  if (args['scripts'] === false) args.scripts = NONE_CHOICE.value;

  return args;
}

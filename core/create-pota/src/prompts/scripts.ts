import prompts from 'prompts';
// @ts-ignore TS is drunk, AGAIN!
import kleur from 'kleur';
import typedObjectEntries from '../util/typedObjectEntries.js';

const { cyan, yellow } = kleur;

export type SupportedScripts = {
  builders?: ReadonlyArray<string>;
  linters?: ReadonlyArray<string>;
  formatters?: ReadonlyArray<string>;
  testRunners?: ReadonlyArray<string>;
  codeGen?: ReadonlyArray<string>;
};

export type SelectedScripts = { [K in keyof SupportedScripts]?: string };

const FORMATTED_SCRIPT = {
  builders: 'builder',
  linters: 'linter',
  formatters: 'formatter',
  testRunners: 'test runner',
  codeGen: 'code generation',
} as const;

export async function promptScripts(scripts: SupportedScripts): Promise<SelectedScripts> {
  const scriptsEntries = typedObjectEntries(scripts);

  const answers = await prompts(
    scriptsEntries.map(([script, values = []]) => {
      const isToggle = values?.length === 1;
      const type = isToggle ? 'toggle' : 'select';
      const otherOptions = isToggle ? { initial: true, active: 'yes', inactive: 'no' } : {};

      const readableScript = FORMATTED_SCRIPT[script as keyof typeof FORMATTED_SCRIPT];

      return {
        type,
        name: script,
        choices: values.map((value) => ({ name: value, title: value })),
        message: isToggle
          ? `Do you want to add ${yellow(values[0])} as your ${cyan(
              readableScript,
            )} scripts package?`
          : `Select a ${readableScript} scripts package`,
        ...otherOptions,
      };
    }),
  );

  return Object.fromEntries(
    scriptsEntries
      .map(([script, values]) => {
        const answer = answers[script as keyof typeof answers];

        if (typeof answer === 'boolean') return answer ? ([script, values![0]] as const) : null;
        if (typeof answer === 'number') return [script, values![answer]] as const;

        return null;
      })
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)),
  );
}

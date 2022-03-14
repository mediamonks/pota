import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

type Constructor<T, Arguments extends unknown[] = any[]> = new (...arguments_: Arguments) => T;

export type OptionsToOptionsDef<Options extends Record<string, unknown>> = {
  [P in keyof Options]: { description?: string; default: Options[P] };
};

export interface Command<
  Options extends Record<string, unknown>,
  Dependencies extends Record<string, unknown> = Record<string, unknown>,
> {
  name: string;
  description?: string;
  examples?: ReadonlyArray<string>;
  options(): OptionsToOptionsDef<Options>;
  action(options: Options, dependencies: Dependencies): void | Promise<void>;
  dependsOn: { [K in keyof Dependencies]: string | ReadonlyArray<string> };
}

export type CommandConstructor<Options extends Record<string, unknown> = Record<string, unknown>> =
  Constructor<Command<Options>>;

export type CommandFunction<Options extends Record<string, unknown> = Record<string, unknown>> = (
  options: Options,
) => void | Promise<void>;

export type CommandModule<Options extends Record<string, unknown> = Record<string, unknown>> =
  | CommandConstructor<Options>
  | CommandFunction<Options>;

export function defineOptions<Options extends Record<string, unknown>>(
  options: OptionsToOptionsDef<Options>,
): OptionsToOptionsDef<Options> {
  return options;
}

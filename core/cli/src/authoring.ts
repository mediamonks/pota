type Constructor<T, Arguments extends unknown[] = any[]> = new (...arguments_: Arguments) => T;

export type OptionsToOptionsDef<O extends Record<string, unknown>> = {
  [P in keyof O]: { description?: string; default: O[P] };
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

export type CommandConstructor = Constructor<Command<Record<string, unknown>>>;

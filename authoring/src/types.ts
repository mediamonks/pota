export interface PackageJsonShape {
  exports?: unknown;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  files?: ReadonlyArray<string>;
  publishConfig?: Record<string, unknown>;
  repository?: Record<string, string>;
  bugs?: Record<string, string>;
  author?: string;
  name?: string;
  version?: string;
}

type Loosen<T> = T extends boolean
  ? boolean
  : T extends string
  ? string
  : T extends number
  ? number
  : T;

export namespace Skeleton {
  export namespace Command {
    export type ActionOptions<T extends Options> = {
      [K in T[0]['option']]: Loosen<T[0]['default']>;
    } & { [K in T[1]['option']]: Loosen<T[1]['default']> } & {
      [K in T[2]['option']]: Loosen<T[2]['default']>;
    } & { [K in T[3]['option']]: Loosen<T[3]['default']> } & {
      [K in T[4]['option']]: Loosen<T[4]['default']>;
    } & { [K in T[5]['option']]: Loosen<T[5]['default']> } & {
      [K in T[6]['option']]: Loosen<T[6]['default']>;
    } & { [K in T[7]['option']]: Loosen<T[7]['default']> } & {
      [K in T[8]['option']]: Loosen<T[8]['default']>;
    } & { [K in T[9]['option']]: Loosen<T[9]['default']> } & {
      [K in T[10]['option']]: Loosen<T[10]['default']>;
    } & { [K in T[11]['option']]: Loosen<T[11]['default']> } & {
      [K in T[12]['option']]: Loosen<T[12]['default']>;
    } & { [K in T[13]['option']]: Loosen<T[13]['default']> } & {
      [K in T[14]['option']]: Loosen<T[14]['default']>;
    } & { [K in T[15]['option']]: Loosen<T[15]['default']> } & {
      [K in T[16]['option']]: Loosen<T[16]['default']>;
    } & { [K in T[17]['option']]: Loosen<T[17]['default']> } & {
      [K in T[18]['option']]: Loosen<T[18]['default']>;
    } & { [K in T[19]['option']]: Loosen<T[19]['default']> } & {
      [K in T[20]['option']]: Loosen<T[20]['default']>;
    } & { [K in T[21]['option']]: Loosen<T[21]['default']> } & {
      [K in T[22]['option']]: Loosen<T[22]['default']>;
    } & { [K in T[23]['option']]: Loosen<T[23]['default']> } & {
      [K in T[24]['option']]: Loosen<T[24]['default']>;
    } & { [K in T[25]['option']]: Loosen<T[25]['default']> } & {
      [K in T[26]['option']]: Loosen<T[26]['default']>;
    } & { [K in T[27]['option']]: Loosen<T[27]['default']> } & {
      [K in T[28]['option']]: Loosen<T[28]['default']>;
    } & { [K in T[29]['option']]: Loosen<T[29]['default']> } & {
      [K in T[30]['option']]: Loosen<T[30]['default']>;
    } & { [K in T[31]['option']]: Loosen<T[31]['default']> };

    export interface Option<O extends string = string, D = unknown> {
      option: O;
      description?: string;
      default?: D;
    }

    export type Options = ReadonlyArray<Option>;

    export type Command<O extends Options> = {
      description?: string;
      examples?: ReadonlyArray<string>;
      options?: O;
      action?(options: ActionOptions<O>): void | Promise<void>;
    };
  }

  export type Meta<AO extends Command.Options> = Record<
    string,
    (options: Command.ActionOptions<AO>, ...args: Array<unknown>) => unknown
  >;

  export interface Config {
    dirname: string;
    scripts?: ReadonlyArray<string>;
    omit?: ReadonlyArray<string>;
    rename?: Record<string, string>;
    commands?: Record<string, Command.Command<[]>>;
    meta?: Meta<[]>;
  }
}

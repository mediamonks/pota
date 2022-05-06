import { resolve, isAbsolute, dirname, basename, extname } from 'path';
import { pathToFileURL } from 'url';

import { paramCase } from 'param-case';
import sade from 'sade';

import { Command, CommandConstructor, CommandFunction, CommandModule } from './authoring.js';
import { CommandModuleWithPath } from './loadCommands.js';

function applyDescription(
  program: sade.Sade,
  command: Command<Record<string, unknown>, Record<string, unknown>>,
) {
  if (!command.description) return;

  program.describe(command.description);
}

function applyOptions(
  program: sade.Sade,
  command: Command<Record<string, unknown>, Record<string, unknown>>,
) {
  const options = command.options?.();
  if (!options) return;

  for (const [option, { description, default: defaultValue }] of Object.entries(options)) {
    program.option(option, description, defaultValue as sade.Value);
  }
}

function applyExamples(
  program: sade.Sade,
  command: Command<Record<string, unknown>, Record<string, unknown>>,
) {
  if (!command.examples) return;

  for (const example of command.examples) {
    program.example(example);
  }
}

function resolveLocalPath(path: string, cwd: string) {
  return resolve(cwd, `pota.${basename(path)}`);
}

function resolvePackagePath(path: string, packagePath: string) {
  // if the path is absolute, then its for a local module
  // @example
  // 'config.js' and '/home/user/pota/scripts/webpack/lib/index.js', become
  // '/home/user/pota/scripts/webpack/lib/config.js'
  if (isAbsolute(packagePath)) return resolve(dirname(packagePath), path);

  // if the path is not absolute, then assume that its an installed npm package
  // @example
  // 'config.js' and '@pota/webpack-scripts', become
  // '@pota/webpack-scripts/config'
  const file = basename(path, extname(path));
  return `${packagePath}/${file}`;
}

async function loadDependencies(
  dependencyPaths: Record<string, string | ReadonlyArray<string>>,
  cwd: string,
  packagePath: string,
  options: unknown,
) {
  const loadedDependencies: Record<string, unknown> = {};

  for (const [dependency, path] of Object.entries(dependencyPaths)) {
    const paths = (Array.isArray(path) ? path : [path])
      .flatMap((p) =>
        isAbsolute(p) ? p : [resolveLocalPath(p, cwd), resolvePackagePath(p, packagePath)],
      )
      .map((p) => (isAbsolute(p) ? pathToFileURL(p).toString() : p));

    let error: Error | null = null;
    for (const path of paths) {
      try {
        loadedDependencies[dependency] = (await import(path as string)).default(options);
        if (loadedDependencies[dependency]) break;
      } catch (error) {
        if ((error as { code: 'ERR_MODULE_NOT_FOUND' }).code !== 'ERR_MODULE_NOT_FOUND') {
          console.warn(`Error loading dependency '${path}':`);
          console.warn(error);
        } else error = error;
      }
    }

    if (!loadedDependencies[dependency] && error) throw error;
  }

  return loadedDependencies;
}

function applyAction(
  program: sade.Sade,
  command: Command<Record<string, unknown>, Record<string, unknown>>,
  cwd: string,
  commandModulePath: string,
) {
  program.action(async (options) => {
    const dependencies = await loadDependencies(
      command.dependsOn ?? {},
      cwd,
      commandModulePath,
      options,
    );

    command.action(options, dependencies);
  });
}

function isNativeClass(value: CommandModule): value is CommandConstructor {
  return typeof value === 'function' && value.toString().indexOf('class') === 0;
}

export function createCommand(main: sade.Sade, cwd: string, commandModule: CommandModuleWithPath) {
  if (!isNativeClass(commandModule)) {
    const commandAction: CommandFunction = commandModule;
    // use the param-case name of the function as the command name
    main.command(paramCase(commandAction.name)).action(({ _: options }) => commandAction(options));
    return;
  }

  const command = new commandModule();

  const program = main.command(command.name);

  applyDescription(program, command);
  applyOptions(program, command);
  applyExamples(program, command);
  applyAction(program, command, cwd, commandModule.path);
}

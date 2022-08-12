import { resolve, isAbsolute, dirname, basename, extname } from 'path';
import { pathToFileURL } from 'url';

import { paramCase } from 'param-case';
import sade from 'sade';

import { Command, CommandConstructor, CommandFunction, CommandModule } from './authoring.js';
import { CommandModuleWithPath } from './loadCommands.js';

/**
 * Register the command description to the cli
 *
 * @param program
 * @param command
 */
function applyDescription(
  program: sade.Sade,
  command: Command<Record<string, unknown>, Record<string, unknown>>,
) {
  if (!command.description) return;

  program.describe(command.description);
}

/**
 * Commands have an `options` getter/property that define which options it supports,
 * which are configured as part of pota-cli
 *
 * @param program
 * @param command
 */
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

/**
 * Register examples from the command to the CLI
 *
 * @param program
 * @param command
 */
function applyExamples(
  program: sade.Sade,
  command: Command<Record<string, unknown>, Record<string, unknown>>,
) {
  if (!command.examples) return;

  for (const example of command.examples) {
    program.example(example);
  }
}

/**
 * Resolves the path to a dependency when it would be present in the project folder, based on convention.
 *
 * If we have a `config.js` dependency, it will try to load `{project_folder}/pota.config.js`.
 *
 * @param {string} path - The path to the file you want to copy.
 * @param {string} cwd - The current working directory.
 * @returns The local path to the dependency using the `pota.{dependency}.(m|c)?js` convention
 */
function resolveLocalPath(path: string, cwd: string): string {
  return resolve(cwd, `pota.${basename(path)}`);
}


/**
 * Resolves the path to a dependency based on the packagePath
 * - If it's a "package", resolve to a package export
 * - If it's a "project folder", resolve it to the js file
 *
 * This is to support running pota-cli from the project repo
 *
 * @param {string} path - the path to the file that we want to resolve
 * @param {string} packagePath - the path to the package that is being resolved
 * @returns The path to the dependency file.
 */
function resolvePackagePath(path: string, packagePath: string) {
  // if the packagePath is absolute, then it's for a local module
  // @example
  // 'config.js' and '/home/user/pota/scripts/webpack/lib/index.js', become
  // '/home/user/pota/scripts/webpack/lib/config.js'
  if (isAbsolute(packagePath)) return resolve(dirname(packagePath), path);

  // if the packagePath is not absolute, then assume that it's an installed npm package
  // @example
  // 'config.js' and '@pota/webpack-scripts', become
  // '@pota/webpack-scripts/config'
  const file = basename(path, extname(path));
  return `${packagePath}/${file}`;
}

/**
 *
 *
 * @param dependencyPaths - A map of dependency names to paths.
 * @param {string} cwd - The current working directory of the process.
 * @param {string} packagePath - The path to the package.json file.
 * @param {unknown} options - The options object passed to the command on execution.
 * @returns A dictionary of the loaded dependencies
 */
async function loadDependencies(
  dependencyPaths: Record<string, string | ReadonlyArray<string>>,
  cwd: string,
  packagePath: string,
  options: unknown,
): Promise<Record<string, unknown>> {
  const loadedDependencies: Record<string, unknown> = {};

  for (const [dependency, path] of Object.entries(dependencyPaths)) {
    // resolve the configured paths to ones that can be imported
    // depending on the format, multiple variations / locations of the dependency are tried
    const paths = (Array.isArray(path) ? path : [path])
      .flatMap((p) =>
        // if the path is already resolve, use that
        // otherwise return both the local and the package path.
        // The cwd path is tried first, and if it doesn't exist, the package path is tried after
        isAbsolute(p) ? p : [resolveLocalPath(p, cwd), resolvePackagePath(p, packagePath)],
      )
      // make sure the file path is in a format that can be imported
      .map((p) => (isAbsolute(p) ? pathToFileURL(p).toString() : p));

    let error: Error | null = null;
    for (const path of paths) {
      try {
        loadedDependencies[dependency] = (await import(path as string)).default(options);
        // if the file exist, and doesn't throw errors, use this one and ignore the other paths for this dependency
        if (loadedDependencies[dependency]) break;
      } catch (importError: any) {
        // TODO: if this is an error we are expecting, why do we log it?
        if ((importError as { code: 'ERR_MODULE_NOT_FOUND' }).code !== 'ERR_MODULE_NOT_FOUND') {
          console.warn(`Error loading dependency '${path}':`);
          console.warn(importError);
        } else {
          // this error is only reported when none of the dependency files could be loaded
          error = importError;
        }
      }
    }

    if (!loadedDependencies[dependency] && error) throw error;
  }

  return loadedDependencies;
}


/**
 * Register the action with pota-cli.
 * The action is the implementation / functionality of the command.
 * An action can have dependencies (other files) that are loaded and provided to the action before execution.
 *
 *
 * @param program - sade.Sade - The program object that we're adding the command to.
 * @param command - The command object that we're applying to the program.
 * @param {string} cwd - The current working directory of the command.
 * @param {string} commandModulePath - The path to the command module.
 */
function applyAction(
  program: sade.Sade,
  command: Command<Record<string, unknown>, Record<string, unknown>>,
  cwd: string,
  commandModulePath: string,
) {
  program.action(async (options) => {
    // load external dependencies, so they can be provided to the action on execution
    // - dependencies are configured using the `dependsOn` dictionary field in the command.
    // - each dependency is a location to a file, or an Array of paths
    // - when loading each dependency, it receives the command options
    const dependencies = await loadDependencies(
      command.dependsOn ?? {},
      cwd,
      commandModulePath,
      options,
    );

    command.action(options, dependencies);
  });
}

/**
 * Determine if the passed Command is a class or function
 *
 * @param {CommandModule} value - CommandModule
 * @returns A boolean value.
 */
function isNativeClass(value: CommandModule): value is CommandConstructor {
  // If the value is a function and the function's string representation starts with the word 'class',
  // then it's a native class.
  return typeof value === 'function' && value.toString().indexOf('class') === 0;
}

/**
 * Creates a "sade command" to use in pota-cli from a command specification in one of the pota scripts.
 * Commands can be either classes or functions, and must adhere to a specific interface.
 *
 * Class commands can also be extended to slightly modify their parent's implementation.
 * This is great for reusing common logic, but make slide variations for specific scripts, languages, frameworks,
 * or in projects for project-specific requirements.
 *
 * @param main - sade.Sade - the main sade instance
 * @param {string} cwd - the current working directory
 * @param {CommandModuleWithPath} commandModule - The command module that we're creating a command for.
 */
export function createCommand(main: sade.Sade, cwd: string, commandModule: CommandModuleWithPath): void {
  // functions can be used as a simplified command, missing descriptions, options, etc.
  // they can make use of the global pota options, but otherwise they are just executed.
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

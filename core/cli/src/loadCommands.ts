import { pathToFileURL } from 'url';
import { resolve, isAbsolute, extname } from 'path';
import { CommandModule } from './authoring.js';

/**
 * Resolve a user-provided path to a module, and resolve it to make it importable.
 *
 * @param {string} path - The path to the module.
 * @param {string} root - The root directory of the project.
 * @returns The resolved path to the module.
 */
export function resolveModulePath(path: string, root: string): string {
  // If the path has an extension, then it's a file path, so we resolve it relative to the root directory.
  if (extname(path)) {
    return isAbsolute(path) ? pathToFileURL(path).toString() : resolve(root, path);
  }

  // A path without any extension resolves as a npm module
  return path;
}

export type CommandModuleWithPath = CommandModule & { path: string };

/**
 * From a list of "pota script paths", return a dictionary with export commands.
 * These will be registered to the pota-cli to be used.
 * Commands with the same name will overwrite previous ones to allow the project to replace or extend pota scripts for
 * project-specific requirements.
 *
 * @param {string} cwd - The current working directory of the process, usually the project root.
 * @param {string[]} paths - An array of paths to load commands from.
 * @returns A promise that resolves to a record of command modules with their paths.
 */
export async function loadCommands(cwd: string, paths: string[]): Promise<Record<string, CommandModuleWithPath>> {
  const commands: Record<string, CommandModuleWithPath> = {};

  for (const path of paths) {
    const resolvedPath = resolveModulePath(path, cwd);
    // this contains all the exported classes or functions that are treated as pota commands
    const modules = await import(resolvedPath);

    for (const [moduleName, m] of Object.entries(modules)) {
      commands[moduleName] = m as CommandModuleWithPath;
      commands[moduleName].path = resolvedPath;
    }
  }

  return commands;
}

import { resolve, isAbsolute, extname } from 'path';
import { CommandModule } from './authoring.js';

export function resolveModulePath(path: string, root: string) {
  if (extname(path)) return isAbsolute(path) ? path : resolve(root, path);

  // if the path does not have an extension, then assume its a npm package
  return path;
}

export type CommandModuleWithPath = CommandModule & { path: string };

export async function loadCommands(cwd: string, paths: string[]) {
  const commands: Record<string, CommandModuleWithPath> = {};

  for (const path of paths) {
    const resolvedPath = resolveModulePath(path, cwd);
    const modules = await import(resolvedPath);

    for (const [moduleName, m] of Object.entries(modules)) {
      commands[moduleName] = m as CommandModuleWithPath;
      commands[moduleName].path = resolvedPath;
    }
  }

  return commands;
}

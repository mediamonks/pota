import { fileURLToPath } from 'url';
import { resolve, dirname, relative, isAbsolute } from 'path';
import { cwd } from 'process';

export function isSubDirectory(parent, directory) {
  const relativePath = relative(parent, directory);

  return relativePath && !relativePath.startsWith('..') && !isAbsolute(relativePath);
}

export const self = dirname(fileURLToPath(import.meta.url));
export const user = cwd();

// Paths relative to the tool
export const skeletonNodeModules = resolve(self, '../node_modules');

// Paths relative to the user
export const source = resolve(user, './src');
export const output = resolve(user, './dist');
export const publicDir = resolve(user, './public');
export const userNodeModules = resolve(user, 'node_modules');

// Paths relative to the source directory
export const entry = resolve(source, './main.ts');

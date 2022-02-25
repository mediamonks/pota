import { resolve, isAbsolute, extname } from 'path';

export function resolveModulePath(path: string, root: string) {
  if (extname(path)) return isAbsolute(path) ? path : resolve(root, path);

  // if the path does not have an extension, then assume its a npm package
  return path;
}

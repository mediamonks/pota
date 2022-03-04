import { fileURLToPath } from 'url';
import { resolve, dirname, relative, isAbsolute } from 'path';
import { cwd } from 'process';

function createPaths() {
  const self = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const user = cwd();

  const source = resolve(user, 'src');

  return {
    self,
    user,
    // Paths relative to the tool
    selfNodeModules: resolve(self, 'node_modules'),

    // Paths relative to the user
    source,
    output: resolve(user, 'dist'),
    publicDir: resolve(user, 'public'),
    userNodeModules: resolve(user, 'node_modules'),
    proxySetup: resolve(user, 'service-worker.js'),

    // Paths relative to the source directory
    entry: resolve(source, 'main.ts'),
    assets: resolve(source, 'assets'),

    serviceWorker: resolve(source, 'service-worker.ts'),
  };
}

export const paths = createPaths();

export function isSubDirectory(parent: string, directory: string) {
  const relativePath = relative(parent, directory);

  return relativePath.length > 0 && !relativePath.startsWith('..') && !isAbsolute(relativePath);
}

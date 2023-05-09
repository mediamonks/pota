import { fileURLToPath } from 'url';
import { resolve, dirname, relative } from 'path';
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
    /*
    When this is an absolute path, on windows it will be loaded as `file://c:/...`.
    Instead it would ideally be loaded as `/c:/...` as a valid "url".
    However, if we make it relative like `src/main.ts`, it will work on both systems.
    This path is inserted into the index.html, so we need to make it relative.
    */
    entry: relative(paths.user, resolve(source, 'main.ts')),

    serviceWorker: resolve(source, 'service-worker.ts'),
  };
}

export const paths = createPaths();

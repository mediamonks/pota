import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';
import { cwd } from 'process';

function createPaths() {
  const self = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const user = cwd();

  const nodeModules = resolve(user, 'node_modules');
  const cache = resolve(nodeModules, '.cache/plop-scripts');

  return {
    self,
    user,
    // Paths relative to the user
    plopfile: resolve(user, 'plopfile.ts'),
    compiledPlopfile: resolve(cache, 'plopfile.mjs'),
  };
}

export const paths = createPaths();

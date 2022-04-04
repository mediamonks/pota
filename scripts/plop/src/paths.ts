import { resolve } from 'path';
import { cwd } from 'process';

function createPaths() {
  const user = cwd();

  return {
    user,
    plopfile: resolve(user, 'plopfile.ts'),
    compiledPlopfile: resolve(user, 'plopfile.mjs'),
  };
}

export const paths = createPaths();

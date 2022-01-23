import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { define } from '@pota/authoring';

import * as paths from './paths.js';

export default define({
  dirname: dirname(fileURLToPath(import.meta.url)),
  scripts: ['typecheck', 'fix', 'fix:eslint', 'format', 'lint', 'lint:eslint', 'rsync'],
  rename: {
    gitignore: '.gitignore',
  },
  commands: {
    dev: {
      async action(options) {
        const config = await this.meta.vite(options);

        await (await import('./actions.js')).dev(options, config, this.skeleton);
      },
    },
    build: {
      async action(options) {
        const config = await this.meta.vite(options);

        await (await import('./actions.js')).build(options, config, this.skeleton);
      },
    },
    preview: {
      async action(options) {
        const config = await this.meta.vite(options);

        await (await import('./actions.js')).preview(options, config, this.skeleton);
      },
    },
  },
  meta: {
    async vite(options) {
      return {
        build: {
          sourcemap: true,
        },
      };
    },
  },
});

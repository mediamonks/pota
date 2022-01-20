import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { define } from '@pota/authoring';
import reactBaseSkeleton from '@pota/react-base-skeleton';

export default define(reactBaseSkeleton, {
  dirname: dirname(fileURLToPath(import.meta.url)),
  omit: ['src/App.tsx'],
  scripts: [
    'postinstall',
    'start-storybook',
    'build-storybook',
    'test',
    'plop',
    'typecheck',
    'typecheck:main',
    'typecheck:tools',
  ],
  meta: {
    async babel() {
      const [config, styledComponentsPlugin] = await Promise.all([
        reactBaseSkeleton.meta.babel(),
        import('babel-plugin-styled-components').then((m) => m.default),
      ]);

      const { plugins = [] } = config;

      return {
        ...config,
        plugins: [...plugins, [styledComponentsPlugin]],
      };
    },
  },
});

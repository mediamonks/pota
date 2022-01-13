import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { define } from '@pota/authoring';
import reactBaseSkeleton from '@pota/react-base-skeleton';

export default define(reactBaseSkeleton, {
  dirname: dirname(fileURLToPath(import.meta.url)),
  omit: ['src/App.tsx'],
  scripts: ['start-storybook', 'build-storybook', 'test'],
  meta: {
    babel() {
      const config = reactBaseSkeleton.babel();
      const { plugins = [] } = config;

      return {
        ...config,
        plugins: [...plugins, ['babel-plugin-styled-components']],
      };
    },
  },
});

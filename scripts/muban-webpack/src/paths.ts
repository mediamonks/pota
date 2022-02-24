import { join, resolve } from 'path';

export * from '@pota/webpack-scripts/paths';

import { paths as webpackPaths } from '@pota/webpack-scripts/paths';

export const paths = {
  ...webpackPaths,
  mocksDir: resolve(webpackPaths.user, 'mocks'),
  mocksOutputDir: resolve(webpackPaths.user, 'dist', 'node'),
  pagesSource: join(webpackPaths.source, 'pages'),
  pagesPublic: join(webpackPaths.source, 'pages', 'public'),
};

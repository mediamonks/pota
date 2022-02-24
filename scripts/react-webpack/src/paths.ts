export * from '@pota/webpack-scripts/paths';
import { paths as webpackPaths } from '@pota/webpack-scripts/paths';

export const paths = {
  ...webpackPaths,
  entry: webpackPaths.entry.replace('.ts', '.tsx'),
};

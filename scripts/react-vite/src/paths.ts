export * from '@pota/vite-scripts/paths';
import { paths as vitePaths } from '@pota/vite-scripts/paths';

export const paths = {
  ...vitePaths,
  entry: vitePaths.entry.replace('.ts', '.tsx'),
};

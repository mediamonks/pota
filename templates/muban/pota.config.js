import { MubanWebpackConfig } from '@pota/muban-webpack-scripts/config';

import { createRequire } from 'module';

const require = createRequire(import.meta.url);

class ProjectWebpackConfig extends MubanWebpackConfig {
  // This file with this configuration is only needed when using Twig to render your templates,
  // and you want to add custom filters or functions to the Twig Environment that is used in
  // the webpack loaders
  get twigEnvironmentPath() {
    return require.resolve('./config/twig/twigEnvironment.cjs')
  }
}

export default (options) => {
  return new ProjectWebpackConfig(options);
};

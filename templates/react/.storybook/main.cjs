function findPlugin(config, name) {
  return config.plugins.find((plugin) => plugin.constructor.name === name);
}

module.exports = {
  core: {
    builder: 'webpack5',
  },
  typescript: {
    check: false,
  },
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: ['../public', 'static'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  async webpackFinal(config) {
    const skeletonWebpackConfig = await (await import('@pota/react-webpack-scripts/config'))
      .default({ 'public-path': '/' })
      .final();

    return {
      ...config,
      resolveLoader: skeletonWebpackConfig.resolveLoader,
      resolve: {
        ...config.resolve,
        alias: { ...config.resolve.alias, ...skeletonWebpackConfig.resolve.alias },
        modules: skeletonWebpackConfig.modules,
      },
      module: { ...config.module, rules: skeletonWebpackConfig.module.rules },
      plugins: [
        ...config.plugins,
        findPlugin(skeletonWebpackConfig, 'DefinePlugin'),
        findPlugin(skeletonWebpackConfig, 'ReactRefreshPlugin'),
      ],
    };
  },
};

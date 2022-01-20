function findPlugin(config, name) {
  return config.plugins.find((plugin) => plugin.constructor.name === name);
}

module.exports =  {
  core: {
    builder: 'webpack5',
  },
  typescript: {
    check: false,
  },
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  async webpackFinal(config) {
    const skeletonConfig = (await import('../.pota/config.js')).default;

    const skeletonWebpackConfig = await skeletonConfig.meta.webpack({}, skeletonConfig.meta.babel());

    return {
      ...config,
      module: { ...config.module, rules: skeletonWebpackConfig.module.rules },
      plugins: [...config.plugins, findPlugin(skeletonWebpackConfig, 'ReactRefreshPlugin')]
    };
  }
}

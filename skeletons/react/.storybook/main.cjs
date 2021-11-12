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
    const { getNestedConfigModulesSelf, createConfig } = await import('@pota/webpack-skeleton/pota/commands/build.js')

    const skeletonConfig = await createConfig(await getNestedConfigModulesSelf());

    const findPlugin = (config, name) => config.plugins.find((plugin) => plugin.constructor.name === name);

    return {
      ...config,
      module: { ...config.module, rules: skeletonConfig.module.rules },
      plugins: [...config.plugins, findPlugin(skeletonConfig, 'ReactRefreshPlugin')]
    };
  }
}

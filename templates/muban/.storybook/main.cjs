const CSS_TEST = /\.css$/;
const SCSS_TEST = /\.(scss|sass)$/;

const ENABLE_MOCK_API_MIDDLEWARE = process.env.MOCK_API === 'true';

function findPlugin(config, name) {
  return config.plugins.find((plugin) => plugin.constructor.name === name);
}

module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: ['../public', '../src/pages/public', 'static'],
  addons: ['@storybook/addon-essentials', '@mediamonks/muban-storybook-addon-transition'],
  async webpackFinal(config) {
    const mubanConfig = await (await getConfig()).mubanConfig();

    const miniCssExtractLoader = findPlugin(mubanConfig, 'MiniCssExtractPlugin').constructor.loader;

    return {
      ...config,
      resolveLoader: mubanConfig.resolveLoader,
      resolve: {
        ...config.resolve,
        alias: { ...config.resolve.alias, ...mubanConfig.resolve.alias },
        modules: mubanConfig.modules,
      },
      module: {
        ...config.module,
        rules: mubanConfig.module.rules.map((rule) =>
          // storybook needs the standard `style-loader`
          [String(CSS_TEST), String(SCSS_TEST)].includes(String(rule.test))
            ? {
                ...rule,
                use: rule.use.map((use) => (use === miniCssExtractLoader ? 'style-loader' : use)),
              }
            : rule
        ),
      },
      plugins: [...config.plugins, findPlugin(mubanConfig, 'DefinePlugin')],
    };
  },
  async managerWebpack(config) {
    if (!ENABLE_MOCK_API_MIDDLEWARE) return config;

    return [config, await (await getConfig()).mocksConfig()];
  },
};

async function getConfig() {
  return (await import('@pota/muban-webpack-scripts/config')).default({
    'mock-api': ENABLE_MOCK_API_MIDDLEWARE,
  });
}


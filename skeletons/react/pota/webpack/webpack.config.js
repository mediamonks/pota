export default function createConfig(config) {
  /**
   * @type {import('webpack').Configuration}
   */
  return {
    ...config,
    module: {
      rules: config.module.rules.map((rule) => ({
        ...rule,
        use:
          rule.use?.map?.((use) =>
            use.loader === "babel-loader"
              ? { ...use, options: updateBabelConfig(use.options) }
              : use
          ) ?? rule.use,
      })),
    },
  };
}

function updateBabelConfig(config) {
  const { plugins = [] } = config;

  return {
    ...config,
    plugins: [...plugins, ["babel-plugin-styled-components"]],
  };
}

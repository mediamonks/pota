import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";

function parseOptions(options) {
  let { profile = false } = options;

  if (profile === "false") profile = false;

  return { profile };
}

const SVG_TEST = /\.(svg)(\?.*)?$/;

export default function createConfig(config, options = {}) {
  const isDev = config.mode
    ? config.mode === "development"
    : process.env.NODE_ENV === "development";

  const { profile } = parseOptions(options);

  /**
   * @type {import('webpack').Configuration}
   */
  return {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        ...(profile && {
          "react-dom$": "react-dom/profiling",
          "scheduler/tracing": "scheduler/tracing-profiling",
        }),
      },
    },
    entry: config.entry.replace(".ts", ".tsx"),
    module: {
      rules: config.module.rules.map((rule) => {
        if (String(rule.test) === String(SVG_TEST)) {
          return {
            test: SVG_TEST,
            use: [
              {
                loader: "@svgr/webpack",
                options: {
                  prettier: false,
                  svgoConfig: {
                    plugins: [{ removeViewBox: false }],
                  },
                  titleProp: true,
                  ref: true,
                },
              },
              { loader: "url-loader" },
            ],
          };
        }

        const use = rule.use?.map?.((use) =>
          use.loader === "babel-loader"
            ? { ...use, options: updateBabelConfig(use.options, isDev) }
            : use
        );

        return { ...rule, use: use ?? rule.use };
      }),
    },
    plugins: [...config.plugins, isDev && new ReactRefreshPlugin({ overlay: false })].filter(
      Boolean
    ),
  };
}

function updateBabelConfig(config, isDev) {
  const { presets = [], plugins = [] } = config;

  return {
    presets: [...presets, ["@babel/preset-react"]],
    plugins: [
      ...plugins,
      ["babel-plugin-styled-components"],
      [
        "babel-plugin-named-asset-import",
        { loaderMap: { svg: { ReactComponent: "@svgr/webpack?-svgo,+titleProp,+ref![path]" } } },
      ],
      isDev && ["react-refresh/babel"],
    ].filter(Boolean),
  };
}

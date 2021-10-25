import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";

import createWebpackSkeletonConfig, {
  parseOptions as parseWebpackSkeletonOptions,
} from "@pota/webpack-skeleton/build-tools/webpack.config.js";
import * as paths from "@pota/webpack-skeleton/build-tools/paths.js";

import getBabelConfig from "./babel.config.js";

function parseOptions(options) {
  let { profile = false } = options;

  if (profile === "false") profile = false;

  return { profile };
}

export default function createConfig(options = {}) {
  const { isDev } = parseWebpackSkeletonOptions(options);
  const config = createWebpackSkeletonConfig(options);
  const {
    resolve,
    module: { rules },
    plugins,
  } = config;

  const { profile } = parseOptions(options);

  /**
   * @type {import('webpack').Configuration}
   */
  return {
    ...config,
    resolve: {
      ...resolve,
      alias: {
        ...resolve.alias,
        ...(profile && {
          "react-dom$": "react-dom/profiling",
          "scheduler/tracing": "scheduler/tracing-profiling",
        }),
      },
    },
    entry: paths.entry.replace(".ts", ".tsx"),
    module: {
      rules: rules.map((rule) => ({
        ...rule,
        use:
          rule.use?.map?.((use) =>
            use.loader === "babel-loader" ? { ...use, options: getBabelConfig(isDev) } : use
          ) ?? rule.use,
      })),
    },
    plugins: [...plugins, isDev && new ReactRefreshPlugin({ overlay: false })].filter(Boolean),
  };
}

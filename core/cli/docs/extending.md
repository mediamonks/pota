# Extending Commands

TODO

# Extending Configurations

The first step is to create a `pota.config.js` in the root of your project.

In there, the starting point is exporting a default function that receives the existing options, and can return the 
new modified options.

```js
export default (options) => {
  return options;
};
```

Each pota script package has a `config.ts` with its specific build tool configuration. To change any of that 
configuration, we use the `pota.config.js` to extend that configuration class.

You can find these in the pota repository in `./scripts/**/src/config.ts`.

## Vite

For Vite, you want to extend the existing configuration of the project, which in this example is `ReactViteConfig`.
So we import that, and extend it while creating a new class for our project specific configuration.

There are different methods that can be overridden, but the final configuration is retrieved from the `final`, so 
that's the "fallback" place to add your config if it doesn't fit in any of the other methods.

In here we make use of the `defineConfig` from `vite` itself, and merge the `super` config with our own additions.

```js
import { ReactViteConfig } from '@pota/react-vite-scripts/config';
import { defineConfig } from 'vite';

class ProjectViteConfig extends ReactViteConfig {
  async final() {
    return defineConfig({
      ...(await super.final()),
      server: {
        proxy: {
          '/api': 'https://example.com/api/',
        },
      },
    });
  }
}

export default (options) => {
  return new ProjectViteConfig(options);
};
```

## Webpack

For Webpack, you want to extend the existing configuration of the project, which in this example is `ReactWebpackConfig`.
So we import that, and extend it while creating a new class for our project specific configuration.

There are different methods that can be overridden, but the final configuration is retrieved from the `final`, so
that's the "fallback" place to add your config if it doesn't fit in any of the other methods.

In here we merge the `super` config with our own additions.

```js
import { ReactWebpackConfig } from '@pota/react-webpack-scripts/config';

class ProjectWebpackConfig extends ReactWebpackConfig {
  async mubanConfig() {
    const superConfig = await super.final();
    return {
      ...superConfig,
      server: {
        ...superConfig.server,
        proxy: {
          '/api': 'https://example.com/api/',
        },
      },
    };
  }
}

export default (options) => {
  return new ProjectWebpackConfig(options);
};
```

[webpack-merge](https://www.npmjs.com/package/webpack-merge) can be used to merge more complex configurations.

## Muban

For Muban, you want to extend the existing configuration of the project, which is `MubanWebpackConfig`.
So we import that, and extend it while creating a new class for our project specific configuration.

There are different methods that can be overridden, but the final configuration for the main webpack build
is retrieved from the `mubanConfig`, so that's the "fallback" place to add your config if it doesn't fit in any of the
other methods.

In there, we merge the `super` config with our own additions.

```js
import { MubanWebpackConfig } from '@pota/muban-webpack-scripts/config';

class ProjectWebpackConfig extends MubanWebpackConfig {
  async mubanConfig() {
    const superConfig = await super.final();
    return {
      ...superConfig,
      server: {
        ...superConfig.server,
        proxy: {
          '/api': 'https://example.com/api/',
        },
      },
    };
  }
}

export default (options) => {
  return new ProjectWebpackConfig(options);
};
```

[webpack-merge](https://www.npmjs.com/package/webpack-merge) can be used to merge more complex configurations.

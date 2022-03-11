---
title: Muban Webpack Scripts
---

# Muban Webpack [![version](https://img.shields.io/npm/v/@pota/muban-webpack-scripts.svg?label=%20)](https://npmjs.org/package/@pota/muban-webpack-scripts)

Commands for building Muban Frontend applications using
[webpack](https://github.com/webpack/webpack).

::: info
extends **[webpack-scripts](/scripts/webpack)**
:::

## Usage

> Creating a new project with muban-webpack-scripts

```bash
npm init pota -- --scripts muban-webpack
```

> Adding it to an existing project

```bash
# install the muban-webpack-scripts and cli packages
npm install @pota/muban-webpack-scripts @pota-cli --save-dev

# configure the cli package to use muban-webpack-scripts
npm pkg set pota="@pota/muban-webpack-scripts"
```

::: tip 
Want to extend this scripts package?

**Take a look at the
[extending section](https://github.com/mediamonks/pota/blob/main/core/cli/docs/extending.md) of
`@pota/cli`.** 
:::

## Commands

### `build`

> Create a production bundle.

```bash
npx pota build
```

| Option                  | Type                                                                          | Default                                                    | Description                                                                                                                                      |
| ----------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`analyze`**           | `{Boolean}`                                                                   | `false`                                                    | When enabled, will open a bundle report after bundling.                                                                                          |
| **`cache`**             | `{Boolean}`                                                                   | `true`                                                     | Toggles webpack's [caching](https://webpack.js.org/configuration/cache/) behavior.                                                               |
| **`image-compression`** | `{Boolean}`                                                                   | `true`                                                     | Toggles image compression.                                                                                                                       |
| **`debug`**             | `{Boolean}`                                                                   | `false`                                                    | Sets NODE_ENV to 'development'.                                                                                                                  |
| **`watch`**             | `{Boolean}`                                                                   | `false`                                                    | Run build and watch for changes.                                                                                                                 |
| **`output`**            | `{String}`                                                                    | `dist/site`                                                | The build output directory.                                                                                                                      |
| **`source-map`**        | `{false\|`[devtool](https://webpack.js.org/configuration/devtool/#devtool)`}` | `hidden-source-map` (production), `cheap-source-map` (development) | Sets the style of source-map, for enhanced debugging. Disable or use faster options in you are having out of memory or other performance issues. |
| **`public-path`**       | `{String}`                                                                    | `/`                                                        | The location of static assets on your production server.                                                                                         |
| **`typecheck`**         | `{Boolean}`                                                                   | `true`                                                     | When disabled, will ignore type related errors.                                                                                                  |
| **`versioning`**        | `{Boolean}`                                                                   | `false`                                                    | When enabled, will copy assets in `./static` to a versioned directory in the output (e.g. `build/version/v2/static/...`).                        |
| **`mock-api`**          | `{Boolean}`                                                                   | `false`                                                    | Toggles support for building API mocks.                                                                                                          |
| **`preview`**           | `{Boolean}`                                                                   | `false`                                                    | Toggles support for building the preview                                                                                                         |

### `dev`

> Start the development server.

```bash
npx pota dev
```

| Option                  | Type                                                                          | Default                                                    | Description                                                                                                                                      |
| ----------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`cache`**             | `{Boolean}`                                                                   | `true`                                                     | Toggle webpack's [caching](https://webpack.js.org/configuration/cache/) behavior.                                                                |
| **`https`**             | `{Boolean}`                                                                   | `false`                                                    | Run the development server with HTTPS.                                                                                                           |
| **`open`**              | `{Boolean}`                                                                   | `true`                                                     | Allows to configure dev server to open the browser after the server has been started.                                                            |
| **`port`**              | `{Number}`                                                                    | `9000`                                                     | Allows configuring the port.                                                                                                                     |
| **`image-compression`** | `{Boolean}`                                                                   | `true`                                                     | Toggles image compression.                                                                                                                       |
| **`prod`**              | `{Boolean}`                                                                   | `false`                                                    | Sets NODE_ENV to 'production'.                                                                                                                   |
| **`source-map`**        | `{false\|`[devtool](https://webpack.js.org/configuration/devtool/#devtool)`}` | `hidden-source-map` (production), `cheap-source-map` (development) | Sets the style of source-map, for enhanced debugging. Disable or use faster options in you are having out of memory or other performance issues. |
| **`typecheck`**         | `{Boolean}`                                                                   | `true`                                                     | Toggles checking for type related errors.                                                                                                        |
| **`mock-api`**          | `{Boolean}`                                                                   | `false`                                                    | Toggles support for building API mocks.                                                                                                          |

## Config Reference [WIP]

see **[webpack-scripts](/scripts/webpack#config-reference-wip)**

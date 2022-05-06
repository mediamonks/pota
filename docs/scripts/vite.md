---
title: Vite Scripts
---

# Vite [![version](https://img.shields.io/npm/v/@pota/vite-scripts.svg?label=%20)](https://npmjs.org/package/@pota/vite-scripts)

Commands for building Frontend applications using [vite](https://github.com/vitejs/vite).

## Usage

> Adding it to an existing project

```bash
# install the vite-scripts and cli packages
npm install @pota/vite-scripts @pota/cli --save-dev

# configure the cli package to use vite-scripts
npm pkg set pota="@pota/vite-scripts"
```

::: tip
Want to extend this scripts package?

**Take a look at the [extending section](https://github.com/mediamonks/pota/blob/main/core/cli/docs/extending.md) of `@pota/cli`.**
:::

## Commands

### `build`

> Create a production bundle.

```bash
npx pota build
```


| Option            | Type                                        | Default  | Description                                                            |
| ----------------- | ------------------------------------------- | -------- | ---------------------------------------------------------------------- |
| **`debug`**       | `{Boolean}`                                 | `false`  | Sets NODE_ENV to 'development'.                                        |
| **`watch`**       | `{Boolean}`                                 | `false`  | Run build and watch for changes.                                       |
| **`output`**      | `{String}`                                  | `./dist` | The build output directory.                                            |
| **`source-map`**  | `{Boolean}`                                 | `false`  | Enable source-map generation                                           |
| **`force`**       | `{Boolean}`                                 | `false`  | Ignore pre-bundled dependencies (the node_modules/.vite cache).        |
| **`public-path`** | `{String}`                                  | `/`      | The location of static assets on your production server.               |
| **`log-level`**   | `{'info' \| 'warn' \| 'error' \| 'silent'}` | `info`   | Adjust console output verbosity. (https://vitejs.dev/config/#loglevel) |

<br />

### dev

> Start the development server.

```bash
npx pota dev
```

| Option            | Type                                        | Default    | Description                                                                                     |
| ----------------- | ------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------- |
| **`https`**       | `{Boolean}`                                 | `false`    | Enables the server's listening socket for TLS (by default, dev server will be served over HTTP) |
| **`open`**        | `{Boolean}`                                 | `true`     | Allows to configure dev server to open the browser after the server has been started.           |
| **`host`**        | `{String \| Boolean}`                       | `127.0.01` | Specify which IP addresses the server should listen on.                                         |
| **`port`**        | `{Number}`                                  | `2001`     | Allows configuring the port.                                                                    |
| **`cors`**        | `{ Boolean }`                               | `false`    | Enables CORS.                                                                                   |
| **`prod`**        | `{Boolean}`                                 | `false`    | Sets NODE_ENV to 'production'.                                                                  |
| **`force`**       | `{Boolean}`                                 | `false`    | Ignore pre-bundled dependencies (the node_modules/.vite cache).                                 |
| **`public-path`** | `{String}`                                  | `/`        | The location of static assets on your production server.                                        |
| **`log-level`**   | `{'info' \| 'warn' \| 'error' \| 'silent'}` | `info`     | Adjust console output verbosity. (https://vitejs.dev/config/#loglevel)                          |

### preview

> Locally preview the production build.

```bash
npx pota preview
```

| Option            | Type                                        | Default    | Description                                                                                     |
| ----------------- | ------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------- |
| **`https`**       | `{Boolean}`                                 | `false`    | Enables the server's listening socket for TLS (by default, dev server will be served over HTTP) |
| **`open`**        | `{Boolean}`                                 | `true`     | Allows to configure dev server to open the browser after the server has been started.           |
| **`host`**        | `{String \| Boolean}`                       | `127.0.01` | Specify which IP addresses the server should listen on.                                         |
| **`port`**        | `{Number}`                                  | `2001`     | Allows configuring the port.                                                                    |
| **`cors`**        | `{Boolean}`                                 | `false`    | Enables CORS.                                                                                   |
| **`force`**       | `{Boolean}`                                 | `false`    | Ignore pre-bundled dependencies (the node_modules/.vite cache).                                 |
| **`public-path`** | `{String}`                                  | `/`        | The location of static assets on your production server.                                        |
| **`log-level`**   | `{'info' \| 'warn' \| 'error' \| 'silent'}` | `info`     | Adjust console output verbosity. (https://vitejs.dev/config/#loglevel)                          |

## Config Reference [WIP]

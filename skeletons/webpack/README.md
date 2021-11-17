# webpack-skeleton [![downloads](https://badgen.now.sh/npm/dm/@pota/webpack-skeleton)](https://npmjs.org/package/@pota/webpack-skeleton)

<div align="center">The skeleton with the <b>foundational webpack configuration</b> for bootstrapping new projects.</div>
<br />

## Setup 🚀

You can create a new project using the `@pota/create` package.

```bash
npx @pota/create webpack my-webpack-app
```

<!--
During project creation, everything above this comment should _ideally_ be replaced with a `Quick Start` on how to run & build the project, referencing the project title in the heading, instead of the skeleton's.
-->

## Standards 📒

This project follows the [MediaMonks Frontend Coding Standards](https://github.com/mediamonks/frontend-coding-standards)

## Features 🔋

### Pota Commands

#### **`build`** - builds the source using `webpack`.

```bash
npm run build # or npx pota build
```

| Option                  | Type                                                                          | Default                                                              | Description                                                                        |
| ----------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **`analyze`**           | `{Boolean}`                                                                   | `false`                                                              | When enabled, will open a bundle report after bundling.                            |
| **`cache`**             | `{Boolean}`                                                                   | `true`                                                               | Toggles webpack's [caching](https://webpack.js.org/configuration/cache/) behavior. |
| **`image-compression`** | `{Boolean}`                                                                   | `true`                                                               | Toggles image compression.                                                         |
| **`mode`**              | `{development\|production}`                                                   | `production`                                                         | Override webpack's [mode](https://webpack.js.org/configuration/mode).              |
| **`output`**            | `{String}`                                                                    | `./build`                                                            | The build output directory.                                                        |
| **`source-map`**        | `{false\|`[devtool](https://webpack.js.org/configuration/devtool/#devtool)`}` | `source-map` (production), `eval-source-map` (development)           | Sets the style of source-map, for enhanced debugging. Disable or use faster options in you are having out of memory or other performance issues. |
| **`public-url`**        | `{String}`                                                                    | `/`                                                                  | The location of static assets on your production server.                           |
| **`type-check`**        | `{Boolean}`                                                                   | `true`                                                               | When disabled, will ignore type related errors.                                    |
| **`versioning`**        | `{Boolean}`                                                                   | `false`                                                              | When enabled, will copy assets in `./static` to a versioned directory in the output (e.g. `build/version/v2/static/...`).                      |


<br />

#### **`dev`** - starts the development service using `webpack-dev-server`.

```bash
npm run dev # or npx pota dev
```

| Option                  | Type                                                                          | Default                                                              | Description                                                                        |
| ----------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **`cache`**             | `{Boolean}`                                                                   | `true`                                                               | Toggle webpack's [caching](https://webpack.js.org/configuration/cache/) behavior.  |
| **`https`**             | `{Boolean}`                                                                   | `false`                                                              | Run the development server with HTTPS.                                             |
| **`image-compression`** | `{Boolean}`                                                                   | `true`                                                               | Toggles image compression.                                                         |
| **`mode`**              | `{development\|production}`                                                   | `production`                                                         | Override webpack's [mode](https://webpack.js.org/configuration/mode).              |
| **`source-map`**        | `{false\|`[devtool](https://webpack.js.org/configuration/devtool/#devtool)`}` | `source-map` (production), `eval-source-map` (development)           | Sets the style of source-map, for enhanced debugging. Disable or use faster options in you are having out of memory or other performance issues. |
| **`type-check`**        | `{Boolean}`                                                                   | `true`                                                               | Toggles checking for type related errors.                                          |

<br />

*hidden TODOs*
<!--
- TODO: describe how to set defaults for these options in `.pota/commands/{command}.js`
- TODO: describe how to create new commands (possible link to `@pota/cli` docs)
-->

<hr />

### Scripts

Non-Pota scripts defined in `"scripts"` of `package.json` and are runnable using `npm run {script}`


| Script             | Description                                                                |
| ------------------ | -------------------------------------------------------------------------- |
| **`check-types`**  | Checks for type errors and unused variables/types in the source directory. |
| **`fix`**          | Executes all `fix:*` commands in sequence.                                 |
| **`fix:eslint`**   | Executes `eslint:lint` and fixes fixable errors.                           |
| **`fix:prettier`** | Formats the source files using `prettier`.                                 |
| **`lint`**         | Executes all `lint:*` commands in sequence.                                |
| **`lint:eslint`**  | Lints the source files using `eslint`.                                     |

<hr />

### JavaScript / TypeScript

*hidden TODOs*
<!--
- TODO: describe `ts-loader` usage how `ts-loader` and `babel` transpile TS and 
- TODO: describe `babel` usage and it plugins
- TODO: describe what ES version is the output and how to control it (`browserslist`) 
- TODO: describe where polyfills go
-->

<hr />

### CSS

*hidden TODOs*
<!--
- TODO: CSS Modules
- TODO: SCSS
- TODO: PostCSS
- TODO: Modernizr?
- TODO: normalize.css?
-->

<hr />

### Images

*hidden TODOs*
<!--
- TODO: describe how we handle SVGs (e.g. `file.svg` vs `file.svg?raw`)
- TODO: describe how we compress image files and how to configure it
-->

<hr />

### Misc. Assets

*hidden TODOs*
<!--
- TODO: describe what other assets the skeleton supports
-->

<hr />

### Linting & Formatting

*hidden TODOs*
<!--
- TODO: describe how `eslint` is included and how to configure it
- TODO: describe how `prettier` is included and how to configure it
-->

<hr />

### Deployment

*hidden TODOs*
<!--
- TODO: describe how `rsync` and the associated `upload-build` script works and how to configure it
-->

<hr />

### Git

*hidden TODOs*
<!--
- TODO: describe `lint-staged` and `husky?`
- TODO: describe how we extract ticket identifiers from branch names
-->

<hr />

### Continuous Integration / Continuous Deployment

#### Bitbucket

`webpack-skeleton` comes with `bitbucket-pipelines.yml`, pre-configured to run `check-types`, `lint` and `test` scripts.

*hidden TODOs*
<!--
- TODO: describe how to use parallelization
- TODO: describe how to setup deploys with `rsync`
-->
# vite-skeleton [![downloads](https://badgen.now.sh/npm/dm/@pota/vite-skeleton)](https://npmjs.org/package/@pota/vite-skeleton)

<div align="center">The skeleton with the <b>foundational vite configuration</b> for bootstrapping new projects.</div>
<br />

## Setup 🚀

You can create a new project using the `@pota/create` package.

```bash
npx @pota/create vite my-vite-app
```

<!--
During project creation, everything above this comment should _ideally_ be replaced with a `Quick Start` on how to run & build the project, referencing the project title in the heading, instead of the skeleton's.
-->

## Standards 📒

This project follows the
[MediaMonks Frontend Coding Standards](https://github.com/mediamonks/frontend-coding-standards)

## Features 🔋

### Pota Commands

#### **`build`** - builds the source using `vite`.

```bash
npm run build # or npx pota build
```

| Option            | Type        | Default  | Description                                                     |
| ----------------- | ----------- | -------- | --------------------------------------------------------------- | ---------- | ------ | ---------------------------------------------------------------------- |
| **`debug`**       | `{Boolean}` | `false`  | Sets NODE_ENV to 'development'.                                 |
| **`output`**      | `{String}`  | `./dist` | The build output directory.                                     |
| **`source-map`**  | `{Boolean}` | `false`  | Enable source-map generation.                                   |
| **`public-path`** | `{String}`  | `/`      | The location of static assets on your production server.        |
| **`log-level`**   | `{'info'    | 'warn'   | 'error'                                                         | 'silent'}` | `info` | Adjust console output verbosity. (https://vitejs.dev/config/#loglevel) |
| **`force`**       | `{Boolean}` | `false`  | Ignore pre-bundled dependencies (the node_modules/.vite cache). |

<br />

#### **`dev`** - starts the vite development server.

```bash
npm run dev # or npx pota dev
```

| Option            | Type        | Default | Description                                                                           |
| ----------------- | ----------- | ------- | ------------------------------------------------------------------------------------- | ---------- | ------ | ---------------------------------------------------------------------- |
| **`force`**       | `{Boolean}` | `false` | Ignore pre-bundled dependencies (the node_modules/.vite cache).                       |
| **`https`**       | `{Boolean}` | `false` | Run the development server with HTTPS.                                                |
| **`open`**        | `{Boolean}` | `true`  | Allows to configure dev server to open the browser after the server has been started. |
| **`port`**        | `{Number}`  | `2001`  | Allows configuring the port.                                                          |
| **`cors`**        | `{Boolean}` | `false` | Enable CORS.                                                                          |
| **`prod`**        | `{Boolean}` | `false` | Sets NODE_ENV to 'production'.                                                        |
| **`log-level`**   | `{'info'    | 'warn'  | 'error'                                                                               | 'silent'}` | `info` | Adjust console output verbosity. (https://vitejs.dev/config/#loglevel) |
| **`public-path`** | `{String}`  | `/`     | The location of static assets on your production server.                              |

<br />

#### **`preview`** - server the built /dist directory.

```bash
npm run preview # or npx pota preview
```

| Option            | Type        | Default | Description                                                                           |
| ----------------- | ----------- | ------- | ------------------------------------------------------------------------------------- | ---------- | ------ | ---------------------------------------------------------------------- |
| **`https`**       | `{Boolean}` | `false` | Run the development server with HTTPS.                                                |
| **`open`**        | `{Boolean}` | `true`  | Allows to configure dev server to open the browser after the server has been started. |
| **`port`**        | `{Number}`  | `2001`  | Allows configuring the port.                                                          |
| **`cors`**        | `{Boolean}` | `false` | Enable CORS.                                                                          |
| **`log-level`**   | `{'info'    | 'warn'  | 'error'                                                                               | 'silent'}` | `info` | Adjust console output verbosity. (https://vitejs.dev/config/#loglevel) |
| **`public-path`** | `{String}`  | `/`     | The location of static assets on your production server.                              |

<br />

_hidden TODOs_

<!--
- TODO: describe how to set defaults for these options in `.pota/commands/{command}.js`
- TODO: describe how to create new commands (possible link to `@pota/cli` docs)
-->

<hr />

### Scripts

Non-Pota scripts defined in `"scripts"` of `package.json` and are runnable using `npm run {script}`

| Script            | Description                                                                |
| ----------------- | -------------------------------------------------------------------------- |
| **`typecheck`**   | Checks for type errors and unused variables/types in the source directory. |
| **`fix`**         | Executes all `fix:*` and `format commands in sequence.                     |
| **`fix:eslint`**  | Executes `eslint:lint` and fixes fixable errors.                           |
| **`format`**      | Formats the source files using `prettier`.                                 |
| **`lint`**        | Executes all `lint:*` commands in sequence.                                |
| **`lint:eslint`** | Lints the source files using `eslint`.                                     |
| **`rsync`**       | Synchronizes (uploads) `dist/` files to a remote server.                   |

<hr />

### JavaScript / TypeScript

_hidden TODOs_

<!--
- TODO: describe `ts-loader` usage how `ts-loader` and `babel` transpile TS and
- TODO: describe `babel` usage and it plugins
- TODO: describe what ES version is the output and how to control it (`browserslist`)
- TODO: describe where polyfills go
-->

<hr />

### CSS

_hidden TODOs_

<!--
- TODO: CSS Modules
- TODO: SCSS
- TODO: PostCSS
- TODO: Modernizr?
- TODO: normalize.css?
-->

<hr />

### Images

_hidden TODOs_

<!--
- TODO: describe how we handle SVGs (e.g. `file.svg` vs `file.svg?raw`)
- TODO: describe how we compress image files and how to configure it
-->

<hr />

### Misc. Assets

_hidden TODOs_

<!--
- TODO: describe what other assets the skeleton supports
-->

<hr />

### Linting & Formatting

_hidden TODOs_

<!--
- TODO: describe how `eslint` is included and how to configure it
- TODO: describe how `prettier` is included and how to configure it
-->

<hr />

### Deployment

#### Remote Sync

For simple deployments, when you just want to upload your files to a remote server, you can use the
`rsync` script.

Note: before using the `rsync` script, make sure to configure a host in in the "package.json"

```bash
npm pkg set config.host="github.com"
```

_hidden TODOs_

<!--
- TODO: describe how `rsync` and the associated `upload-build` script works and how to configure it
-->

<hr />

### Git

_hidden TODOs_

<!--
- TODO: describe `lint-staged` and `husky?`
- TODO: describe how we extract ticket identifiers from branch names
-->

<hr />

### Continuous Integration / Continuous Deployment

#### Bitbucket

`webpack-skeleton` comes with `bitbucket-pipelines.yml`, pre-configured to run `check-types`, `lint`
and `test` scripts.

_hidden TODOs_

<!--
- TODO: describe how to use parallelization
- TODO: describe how to setup deploys with `rsync`
-->

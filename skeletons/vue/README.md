# vue-skeleton [![downloads](https://badgen.now.sh/npm/dm/@pota/vue-skeleton)](https://npmjs.org/package/@pota/vue-skeleton) ![extends](https://badgen.net/badge/extends/@pota%2Fvue-base-skeleton/blue)

<div align="center">The <b>de-facto Vue skeleton</b> for new projects.</div>
<br />

## Setup 🚀

You can create a new project using the `@pota/create` package.

```bash
npx @pota/create vue my-vue-app
```

<!--
During project creation, everything above this comment should _ideally_ be replaced with a `Quick Start` on how to run & build the project, referencing the project title in the heading, instead of the skeleton's.
-->


<!--
TODO: How to include the content from the `README.md` of `vue-base-skeleton` ?
As now I have to copy it over on every change -_- (This is the second time I copied this file 😠😠 )
-->

## Standards 📒

This project follows the [MediaMonks Frontend Coding Standards](https://github.com/mediamonks/frontend-coding-standards)

## Project Structure ⛩️

### [source](./src)

#### [src/components](./src/components)

The `components` folder follows [atomic design](https://bradfrost.com/blog/post/atomic-web-design/)
guidelines, with a few additions:

| Folder             | Description                                                                                                                                      | Example                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------ |
| **`/atoms`**       | The smallest unit, must be self contained and not dependant on any external modules. (types and configuration being the exception)               | `Icon`, `Paragraph`, `Heading`       |
| **`/molecules`**   | Must be restrained to only use atoms and minimal internal state.                                                                                 | `Toggle`                             |
| **`/organisms`**   | Generally reserved for complex state uses and must use `atoms` or `molecules`.                                                                   | `Form`                               |
| **`/layout`**      | Components whose only function is taking in children and presenting them in a specific layout. Must not use `atoms`, `molecules` or `organisms`. | `Carousel`, `Modal`, `Tabs`          |
| **`/pages`**       | Components which are used as pages.                                                                                                              | `Home`, `About`                      |
| **`/unlisted`**    | Components which do not fall into any of the above categories.                                                                                   | `App`, _global context providers_    |


#### [src/config](./src/config)

The `config` folder is to be used to define any sort of configuration for styles, components or logic.

*hidden TODOs*
<!--
- TODO: describe what's going on with those empty `package.json`'s
-->


<hr />

## Features 🔋

### Pota Commands

#### **`build`** - builds the source using `webpack`.

```bash
npm run build # or npx pota build
```

| Option                    | Type                                                                          | Default                                                              | Description                                                                        |
| ------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **`analyze`**             | `{Boolean}`                                                                   | `false`                                                              | When enabled, will open a bundle report after bundling.                            |
| **`cache`**               | `{Boolean}`                                                                   | `true`                                                               | Toggles webpack's [caching](https://webpack.js.org/configuration/cache/) behavior. |
| **`image-compression`**   | `{Boolean}`                                                                   | `true`                                                               | Toggles image compression.                                                         |
| **`mode`**                | `{development\|production}`                                                   | `production`                                                         | Override webpack's [mode](https://webpack.js.org/configuration/mode).              |
| **`output`**              | `{String}`                                                                    | `./build`                                                            | The build output directory.                                                        |
| **`source-map`**          | `{false\|`[devtool](https://webpack.js.org/configuration/devtool/#devtool)`}` | `source-map` (production), `eval-source-map` (development)           | Sets the style of source-map, for enhanced debugging. Disable or use faster options in you are having out of memory or other performance issues. |
| **`public-url`**          | `{String}`                                                                    | `/`                                                                  | The location of static assets on your production server.                           |
| **`type-check`**          | `{Boolean}`                                                                   | `true`                                                               | When disabled, will ignore type related errors.                                    |
| **`versioning`**          | `{Boolean}`                                                                   | `false`                                                              | When enabled, will copy assets in `./static` to a versioned directory in the output (e.g. `build/version/v2/static/...`).                      |
| **`vue-options-api`**     | `{Boolean}`                                                                   | `false`                                                              | Toggles the [Vue Options API](https://v3.vuejs.org/api/options-api).               |
| **`vue-prod-devtools`**   | `{Boolean}`                                                                   | `false`                                                              | Toggles support for the Vue Devtools in **production**.                            |

<br />

#### **`dev`** - starts the development service using `webpack-dev-server`.

```bash
npm run dev # or npx pota dev
```

| Option                    | Type                                                                          | Default                                                              | Description                                                                        |
| ------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **`cache`**               | `{Boolean}`                                                                   | `true`                                                               | Toggle webpack's [caching](https://webpack.js.org/configuration/cache/) behavior.  |
| **`https`**               | `{Boolean}`                                                                   | `false`                                                              | Run the development server with HTTPS.                                             |
| **`image-compression`**   | `{Boolean}`                                                                   | `true`                                                               | Toggles image compression.                                                         |
| **`mode`**                | `{development\|production}`                                                   | `production`                                                         | Override webpack's [mode](https://webpack.js.org/configuration/mode).              |
| **`source-map`**          | `{false\|`[devtool](https://webpack.js.org/configuration/devtool/#devtool)`}` | `source-map` (production), `eval-source-map` (development)           | Sets the style of source-map, for enhanced debugging. Disable or use faster options in you are having out of memory or other performance issues. |
| **`type-check`**          | `{Boolean}`                                                                   | `true`                                                               | Toggles checking for type related errors.                                          |
| **`vue-options-api`**     | `{Boolean}`                                                                   | `false`                                                              | Toggles the [Vue Options API](https://v3.vuejs.org/api/options-api).               |

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
- TODO: explain included css and how to utilize it
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

### Storybook

*hidden TODOs*
<!--
- TODO: describe storybook related stuff
- TODO: describe how to create new stories
-->

<hr />

### Testing

*hidden TODOs*
<!--
- TODO: describe how to use jest
- TODO: describe how to create new tests
- TODO: describe what you can't do (no support for Vue 3 components, so can't render them in tests)
-->

<hr />

### Web Vitals

*hidden TODOs*
<!--
- TODO: describe how to best utilize the included `web-vitals` package to benchmark first load performance
-->

<hr />

### Routing

*hidden TODOs*
<!--
- TODO: describe how to do `vue-router` stuff
-->

<hr />

### State Management

*hidden TODOs*
<!--
- TODO: describe how to do `vuex` stuff
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

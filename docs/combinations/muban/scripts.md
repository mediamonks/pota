# Scripts

The `package.json` is filled with scripts you can use to do all sorts of things in your project. The
most important ones are described below.

## Development

### `npm run dev`

Your goto script when running local development against local page templates with live and hot
reloading when any of your code changes.

It runs on a pair of webpack compilers: one for the Muban application bundle and one for converting
page TypeScript files into HTML files.

The dev server runs on `http://localhost:9000`.

### `npm run dev -- --mock-api`

Runs the development server with an mock API middleware compiling the mocks from the `/mocks`
directory.

### `npm run build -- --watch`

Runs the same build process as the normal `npm run build`, but now in watch mode, enjoying fast
recompilations when your local files change.

### `npm run build -- --debug --watch`

Runs the same build process as the normal `npm run build -- --watch`, but the output code is without
production optimizations.

Useful for live local development against your CMS rendered pages.

### `npm run storybook`

Develop and test your components in storybook.

### `npm run storybook:mock-api`

Same as `npm run storybook`, but with the mock API bundling and middleware enabled.

## Builds

### `npm run build`

Creates a distribution build that outputs the JavaScript, CSS and bundled asset files. Used in CI to
deploy to your production websites.

### `npm run build -- --preview`

Generates a full preview package including generated HTML files to upload to a preview server that's
not connected to any backend.

### `npm run build -- --debug`

Generates a debug build without any minification or other optimizations. Useful for integration
tests where you are not deploying to production yet, but want to see your changes on a (local)
integration server as soon as possible.

### `npm run build -- --mock-api`

In addition to the standard build, generates a node server for running
[monck](https://github.com/mediamonks/monck) mocks.

### `npm run storybook:build`

Make a deployable storybook build to showcase your components to others.

> NOTE: if you are unsure about what options you can pass to the `dev` or `build` scripts, you can
> always get more information by passing the `--help` argument. e.g. `npm run build -- --help`

## Others

### previewing the build

Sometimes you want to test the build output `npm run build -- --preview` to locally debug
minification & optimizations applied by webpack in production mode. Instead of shipping a custom
server or a dependency to support this, we are recommending to utilize existing packages through
`npx`:

> serve `./dist/site` directory

```bash
npx http-server ./dist/site
```

> with SSL/TLS enabled (https)

```bash
npx create-ssl-certificate && npx http-server ./dist/site -S -C ssl.crt -K ssl.key
```

> include running the built mocks from `./dist/node/mocks`

```bash
npx concurrently "npx monck -d ./dist/node/mocks -p 9002" "npx http-server ./dist/site --proxy http://localhost:9002"
```

### uploading the build to a remote server

If you do not have a backend setup to host your components, you likely still want to deploy your
changes to a remote server. The skeleton provides two scripts to support uploading both the preview
site and the [monck](https://github.com/mediamonks/monck) mocks.

- `npm run rsync` - upload the preview site
- `npm run rsync:mocks` - upload the mocks node server
- `npm run rsync:storybook` - upload the storybook build

### Formatting/Linting

| Script            | Description                                                                |
| ----------------- | -------------------------------------------------------------------------- |
| **`typecheck`**   | Checks for type errors and unused variables/types in the source directory. |
| **`fix`**         | Executes all `fix:*` and `format commands in sequence.                     |
| **`fix:eslint`**  | Executes `eslint:lint` and fixes fixable errors.                           |
| **`format`**      | Formats the source files using `prettier`.                                 |
| **`lint`**        | Executes all `lint:*` commands in sequence.                                |
| **`lint:eslint`** | Lints the source files using `eslint`.                                     |

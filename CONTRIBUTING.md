# Contributing to Pota

Please look through this document for insights in how the project is setup and how to contribute.

## Setting up the project

The repository has 4 separate root folders:

```bash
docs/
core/
scripts/
templates/
```

### `docs/`

Contains the documentation hosted at [mediamonks.github.io/pota](https://mediamonks.github.io/pota)

```bash
# setup dependencies
npm install

# run local docs dev server
npm run dev

# run production docs build
npm run build
```

### `core/`

An [npm workspace](https://docs.npmjs.com/cli/v8/using-npm/workspaces) that hosts all of the core packages.

```bash
# setup dependencies
npm install

# run build for all core packages
npm run build -ws

# run build only for the cli package
npm run build -w cli

# run build only for the create-pota package
npm run build -w create-pota
```

### `scripts/`

An [npm workspace](https://docs.npmjs.com/cli/v8/using-npm/workspaces) that hosts all scripts packages.

```bash
# setup dependencies
npm install

# run build for all scripts packages
npm run build -ws

# run build only for the webpack scripts package
npm run build -w webpack
```

> NOTE: if you are locally working with a scripts package that extends another (e.g. `muban-webpack`, extends `webpack`),
> make sure to first build the parent package (e.g. build `webpack` before `muban-webpack`, once).

### `templates/`

A folder with individual template packages.

```bash
# setup dependencies for each template

npm install --prefix=vanilla
npm install --prefix=muban
npm install --prefix=react
npm install --prefix=<template-folder>
```

## Working with local `templates`, `scripts` and `@pota/cli`

It would be quite a chore to have to constantly re-create a project after making changes to either one of the `templates`, `scripts` or the `@pota/cli` package. Each of the `templates` are setup in a way where they are almost immediately ready to be utilized as a project.

```bash
# change directory into selected template
cd templates/vanilla

# install the cli package
npm install @pota/cli

# let the cli know to load the local scripts module
npm pkg set pota="../../scripts/webpack/lib/index.js"
```

> NOTE: if you want to work on the local cli package, then replace the second step with `npm install ../../core/cli`

## Creating projects from local `templates`

[`@pota/create`](core/create-pota) supports project creation from local packages.

> Example:

```bash
npm init @pota -- --template templates/vanilla
```

NOTE: [`@pota/create`](core/create-pota) currently does not support project creation with local scripts packages.
However, these can be easily installed after the project is created (see next section). To skip scripts selection you can pass `--no-scripts`.

> Example:

```bash
npm init @pota -- --template templates/vanilla --no-scripts
```

## Known Issues

### explicit usage of a scripts package in storybook configuration

Currently, we have 2 templates that are using storybook - [`muban`](./templates/muban) and [`react`](./templates/react).
It is expected that the storybook bundle configuration matches that of the application. Because the application bundle
configuration is provided by scripts packages, we need to somehow pass that configuration to storybook.

The way its currently done, is that we assume what scripts package the developer will choose for a given template, and hardcode
its usage in the `.storybook/main.cjs` file.

We must not make any assumptions on what the user will use, as that can and will cause issues.

The fix is being tracked in https://github.com/mediamonks/pota/issues/41

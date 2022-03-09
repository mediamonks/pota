# Contributing to Pota [WIP]

Please look through this document for insights in how the project is setup and how to contribute.

## Creating projects from local `templates`

[`create-pota`](core/create-pota) supports project creation from local packages.

> Example:

```bash
npm init pota -- --template templates/vanilla
```

NOTE: [`create-pota`](core/create-pota) currently does not support project creation with local scripts packages.
However, these can be easily installed after the project is created (see next section). To skip scripts selection you can pass `--no-scripts`.

> Example:

```bash
npm init pota -- --template templates/vanilla --no-scripts
```

## Working with local `templates`, `scripts` and `@pota/cli`

It would be quite a chore to have to constantly re-create a project after making changes to either one of the `templates`, `scripts` or the `@pota/cli` package. Each of the `templates` are setup in a way where they are almost immediately ready to be utilized as a project.

```bash
cd templates/vanilla # change directory into selected template

npm install ../../core/cli # (optional) install the local cli package

npm pkg set pota="../../scripts/webpack/lib/index.js" # let the cli know to load the local scripts module
```

# FAQ

## Why are the `core` and `scripts` packages using nightly TypeScript?

As most of the ecosystem is undergoing a transition from using CJS to native ES modules, it makes
sense for a new package to support ESM, especially because Pota has its own closed ecosystem
independent from other existing packages. Due to this, the project was started with TypeScript 4.5
beta, as it included support for emitting native ESM. However, the release candidate for TypeScript
4.5,
[removed support for this feature](https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-rc/#esm-nodejs)
and the accompanying `module` types `nodenext` and `node12`.

So instead of rewriting code back to CJS, the project will continue using a stable version of
nightly TypeScript, to continue properly supporting ESM.

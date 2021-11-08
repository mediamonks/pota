# Contributing to Pota [WIP]

Please look through this document for insights in how the project is setup and how to contribute.

## Folder Structure

### Overview

```
core/
  cli/
  create/
  shared/

skeletons/
  webpack/
  react/
  vue/
```

### Package Descriptions

#### [@pota/cli](https://github.com/mediamonks/pota/tree/main/core/cli)

The local CLI package that is used within skeletons and projects to add and run custom commands.

#### [@pota/create](https://github.com/mediamonks/pota/tree/main/core/create)

The global CLI package that handles project creation from skeletons.

#### [@pota/shared](https://github.com/mediamonks/pota/tree/main/core/shared)

A collection of shared utilities used in `@pota/cli` and `@pota/create`

#### [@pota/webpack-skeleton](https://github.com/mediamonks/pota/tree/main/skeletons/webpack)

The official webpack skeleton. It should contain the base (but best) webpack setup and commands to
execute it.

#### [@pota/react-skeleton](https://github.com/mediamonks/pota/tree/main/skeletons/react)

The official react skeleton. It extends the `@pota/webpack-skeleton` and contains the best agreed
React setup.

#### [@pota/vue-skeleton](https://github.com/mediamonks/pota/tree/main/skeletons/vue)

The official vue skeleton. It extends the `@pota/webpack-skeleton` and contains the best agreed Vue
setup.

# FAQ

## Why are the core packages using nightly TypeScript?

As most of the ecosystem is undergoing a transition from using CJS to native ES modules, it makes
sense for a new package to support ESM, especially because Pota has its own closed ecosystem
independent from other existing packages. Due to this, the project was started with TypeScript 4.5
beta, as it included support for emitting native ESM. However, the release candidate for TypeScript
4.5,
[removed support for this feature](https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-rc/#esm-nodejs)
and the accompanying `module` types `nodenext` and `node12`.

So instead of rewritting code back to CJS, the project will continue using a stable version of
nightly TypeScript, to continue properly supporting ESM.

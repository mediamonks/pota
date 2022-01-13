# Contributing to Pota [WIP]

Please look through this document for insights in how the project is setup and how to contribute.

## Folder Structure

### Overview

```
core/
  cli/
  create/
  authoring/

skeletons/
  webpack/
  react/
  react-base/
  vue/
  vue-base/
```

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

# `@pota/create` ![downloads](https://badgen.now.sh/npm/dm/@pota/create)

<div align="center">The starting point for new Pota-powered projects.</div>

## Usage ✨

To create a new project you can use one of the following methods:

```bash
npm init @pota react my-react-app
```

```bash
npx @pota/create vue my-vue-app
```

Below is a list of all of the officially supported skeletons:

| Skeleton                                     | Shorthand    | Version                                                                                              |
| -------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------- |
| [@pota/webpack-skeleton](skeletons/webpack)  | `webpack`    | ![webpack-skeleton version](https://img.shields.io/npm/v/@pota/webpack-skeleton.svg?label=%20)       |
| [@pota/react-skeleton](skeletons/react)      | `react`      | ![react-skeleton version](https://img.shields.io/npm/v/@pota/react-skeleton.svg?label=%20)           |
| [@pota/react-base-skeleton](skeletons/react) | `react-base` | ![react-base-skeleton version](https://img.shields.io/npm/v/@pota/react-base-skeleton.svg?label=%20) |
| [@pota/vue-skeleton](skeletons/vue)          | `vue`        | ![vue-skeleton version](https://img.shields.io/npm/v/@pota/vue-skeleton.svg?label=%20)               |
| [@pota/vue-base-skeleton](skeletons/vue)     | `vue-base`   | ![vue-base-skeleton version](https://img.shields.io/npm/v/@pota/vue-base-skeleton.svg?label=%20)     |

You are by no means limited to the official skeletons. `@pota/create` supports _any_ npm package as
a skeleton, as long as it includes a `.pota/config.js` file. This also means that skeletons can be
git repositories, local folders and anything
[npm supports as a dependency](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies).

> example of a repository skeleton

```bash
npm init @pota git@github.com:{user}/{repo}#{branch} my-app
```

> example of a folder skeleton

```bash
npx @pota/create file:../this-is-my-local-skeleton my-app
```

## Skeleton Configuration 🔧

_hidden TODOs_

<!--
- TODO: how to use `.pota`
- TODO: what are the options of `.pota/config.js`
- TODO: describe how skeleton dependencies are processed
- TODO: describe how skeleton source is synchronized
- TODO: describe how nested skeletons are handled
-->

# `@pota/create` · ![version](https://img.shields.io/npm/v/@pota/create.svg?label=%20) ![downloads](https://badgen.now.sh/npm/dm/create-pota)

## Creating a Pota Project

You can create a new pota project using `npm init`:

```bash
npm init @pota
```

Then follow the prompts.

### Official Templates

| Package                                                        | Version                                                                                          |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [webpack](npmjs.com/package/@pota/webpack-scripts)             | ![webpack version](https://img.shields.io/npm/v/@pota/webpack-scripts.svg?label=%20)             |
| [react-webpack](npmjs.com/package/@pota/react-webpack-scripts) | ![react-webpack version](https://img.shields.io/npm/v/@pota/react-webpack-scripts.svg?label=%20) |
| [muban-webpack](npmjs.com/package/@pota/muban-webpack-scripts) | ![muban-webpack version](https://img.shields.io/npm/v/@pota/muban-webpack-scripts.svg?label=%20) |
| [vite](npmjs.com/package/@pota/vite-scripts)                   | ![vite version](https://img.shields.io/npm/v/@pota/vite-scripts.svg?label=%20)                   |
| [react-vite](npmjs.com/package/@pota/react-vite-scripts)       | ![react-vite version](https://img.shields.io/npm/v/@pota/react-vite-scripts.svg?label=%20)       |

### Official Scripts

| Package                                                   | Version                                                                                     |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [vanilla](npmjs.com/package/@pota/vanilla-template)       | ![vanilla version](https://img.shields.io/npm/v/@pota/vanilla-template.svg?label=%20)       |
| [react](npmjs.com/package/@pota/react-template)           | ![react version](https://img.shields.io/npm/v/@pota/react-template.svg?label=%20)           |
| [react-base](npmjs.com/package/@pota/react-base-template) | ![react-base version](https://img.shields.io/npm/v/@pota/react-base-template.svg?label=%20) |
| [muban](npmjs.com/package/@pota/muban-template)           | ![muban version](https://img.shields.io/npm/v/@pota/muban-template.svg?label=%20)           |
| [next](npmjs.com/package/@pota/next-template)             | ![next version](https://img.shields.io/npm/v/@pota/next-template.svg?label=%20)             |

### Combinations

`@pota/create` also has a few built-in template & scripts combinations for recommended setups:

```bash
# combination: muban
# scripts:   [@pota/muban-webpack-scripts]
# template:  @pota/muban-template

npm init @pota muban

# combination: react
# scripts:   [@pota/react-webpack-scripts]
# template:  @pota/react-template

npm init @pota react

# combination: react-base
# scripts:   [@pota/react-webpack-scripts]
# template:  @pota/react-base-template

npm init @pota react-base

# combination: vanilla
# scripts:   [@pota/webpack-scripts]
# template:  @pota/vanilla-template

npm init @pota vanilla
```

### Custom Templates without scripts

> example for [vue-skeleton](https://github.com/hjeti/vue-skeleton)

```bash
npm init @pota -- --template github:hjeti/vue-skeleton
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md)

## License

Pota is [MIT licensed](../../LICENSE).

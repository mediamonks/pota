# Pota

**Pota** - a collection of tools to support the **creation** and **management** of Node.js projects.

- **Create**: Pota provides you with a set of officially supported and managed [`templates`](templates) and [`scripts`](scripts), which can be composed together into a project using the [`create-pota`](core/create-pota) command. It also allows you to bring your own [`template`](templates) or [`scripts`](scripts), if you already have something that you are comfortable with, but still want to utilize [`create-pota`](core/create-pota).
- **Manage**: Have you ever wanted to change something about your build tool, customize it or easily add new commands? The [`@pota/cli`](core/cli) package and the [`scripts`](scripts) designed around it provide you with such possibilities.

All of this and more is possible through the `pota` command.

## Getting Started

To get started, we recommend creating a brand new project using [`create-pota`](core/create-pota):

```bash
npm init pota@latest
```

## Packages

| Package                                              | Type                  | Version                                                                                          |
| ---------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------ |
| [create-pota](core/create-pota)                      | [Core](core)          | ![create-pota version](https://img.shields.io/npm/v/create-pota.svg?label=%20)                   |
| [@pota/cli](core/cli)                                | [Core](core)          | ![cli version](https://img.shields.io/npm/v/@pota/cli.svg?label=%20)                             |
| [@pota/webpack-scripts](scripts/webpack)             | [Scripts](scripts)    | ![webpack version](https://img.shields.io/npm/v/@pota/webpack-scripts.svg?label=%20)             |
| [@pota/react-webpack-scripts](scripts/react-webpack) | [Scripts](scripts)    | ![react-webpack version](https://img.shields.io/npm/v/@pota/react-webpack-scripts.svg?label=%20) |
| [@pota/muban-webpack-scripts](scripts/muban-webpack) | [Scripts](scripts)    | ![muban-webpack version](https://img.shields.io/npm/v/@pota/muban-webpack-scripts.svg?label=%20) |
| [@pota/vite-scripts](scripts/vite)                   | [Scripts](scripts)    | ![vite version](https://img.shields.io/npm/v/@pota/vite-scripts.svg?label=%20)                   |
| [@pota/react-vite-scripts](scripts/vite-react)       | [Scripts](scripts)    | ![react-vite version](https://img.shields.io/npm/v/@pota/react-vite-scripts.svg?label=%20)       |
| [@pota/vanilla-template](templates/vanilla)          | [Template](templates) | ![vanilla version](https://img.shields.io/npm/v/@pota/vanilla-template.svg?label=%20)            |
| [@pota/react-template](templates/react)              | [Template](templates) | ![react version](https://img.shields.io/npm/v/@pota/react-template.svg?label=%20)                |
| [@pota/react-base-template](templates/react-base)    | [Template](templates) | ![react-base version](https://img.shields.io/npm/v/@pota/react-base-template.svg?label=%20)      |
| [@pota/muban-template](templates/muban)              | [Template](templates) | ![muban version](https://img.shields.io/npm/v/@pota/muban-template.svg?label=%20)                |
| [@pota/next-template](next/muban)                    | [Template](templates) | ![next version](https://img.shields.io/npm/v/@pota/next-template.svg?label=%20)                  |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

Pota is [MIT licensed](LICENSE).

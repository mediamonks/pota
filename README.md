# Pota · ![cli](https://img.shields.io/npm/v/@pota/cli?label=%40pota%2Fcli) ![create](https://img.shields.io/npm/v/create-pota?label=create-pota)

Pota is for creating and operating Node.js projects.

- **Create**: Pota provides you with a set of officially supported and managed [`templates`](templates) and [`scripts`](scripts), which can be composed together into a project using the [`create-pota`](core/create-pota) command. It also allows you to bring your own [`template`](templates) or [`scripts`](scripts), if you already have something that you are comfortable with, but still want to utilize [`create-pota`](core/create-pota).
- **Operate**: Have you ever wanted to change something about your build tool, customize it or easily add new commands? The [`@pota/cli`](core/cli) package and the [`scripts`](scripts) designed around it provide you with such possibilities.

All of this and more is possible through the `pota` command.

## Getting Started

To get started, we recommend creating a brand new project using [`create-pota`](core/create-pota):

```bash
npm init pota@latest
```

> with yarn

```bash
yarn create pota
```

## Documentation

- [Core](core)
- [Templates](templates)
- [Scripts](scripts)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

Pota is [MIT licensed](LICENSE).

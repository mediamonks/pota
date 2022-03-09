# `@pota/cli` · ![version](https://img.shields.io/npm/v/@pota/cli.svg?label=%20) ![downloads](https://badgen.now.sh/npm/dm/@pota/cli)

Create, extend and run CLI applications.

## Install

```bash
npm install @pota/cli
```

## Usage

If your project already has [local commands](docs/authoring.md) or a
[scripts package](../../scripts/) setup. You can call those commands with the `pota` binary:

```bash
npx pota <insert-command>
```

unsure what commands are available?

> run `pota` with the `--help` argument to see the loaded commands

```bash
npx pota --help
```

unsure what options are available for command `<insert-command>` ?

> run `pota <insert-command>` with the `--help` argument to see available options for the command

```bash
npx pota <insert-command> --help
```

---

If your project **does not have** [local commands](docs/authoring.md) or a
[scripts package](../../scripts/) setup. You can use one of the [official scripts](../../scripts)
packages or define your own commands [locally](docs/authoring.md).

> example using [`@pota/webpack-scripts`](https://www.npmjs.com/package/@pota/webpack-scripts)

`@pota/cli` needs to to know where it can find its commands, this can be done by setting the `pota`
key in your project's `package.json`:

```bash
npm pkg set pota="@pota/webpack-scripts"
```

> example package.json

```json
{
  "name": "pota-project",
  "pota": "@pota/webpack-scripts"
}
```

## Documentation

- [Authoring Commands](docs/authoring.md)
- [Extending Commands](docs/extending.md)
- [Using Dependencies](docs/dependencies.md)

## Tips

- **The `pota` field in `package.json` supports arrays; you can define multiple command
  sources:**<br>

```bash
npm pkg set pota[0]="@pota/webpack-scripts" pota[1]="other-scripts"
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md)

## License

Pota is [MIT licensed](../../LICENSE).

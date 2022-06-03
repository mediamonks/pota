# muban-template [![downloads](https://badgen.now.sh/npm/dm/@pota/muban-template)](https://npmjs.org/package/@pota/muban-template)

## Setup 🚀

You can create a new project using
[`create-pota`](https://github.com/mediamonks/pota/tree/main/core/create-pota).

```bash
npm init pota -- --template muban
```

> or use the `muban` combination, for the recommeded setup

```bash
npm init pota muban
```

## Standards 📒

This project follows the
[Media.Monks Frontend Coding Standards](https://github.com/mediamonks/frontend-coding-standards).

## Security 👮‍

### Ignore scripts
In order to mitigate NPM supply chain attacks by best effort the NPM [ignore-scripts](https://docs.npmjs.com/cli/v8/commands/npm-install#ignore-scripts) setting is enabled by default. This project
comes with a preconfigured set of dependencies that are allowed to run installation scripts.

After running `npm install` it is required to run `npm run postinstall` to run required installation scripts from dependent packages.

When adding a new dependency that requires an installation script to run make sure to add that package to the project `package.json` in the `postinstall` property.

> Important: After running `npm install` or `npm ci` always run `npm run postinstall` afterwards before running other scripts.

## Documentation 📄

Documentation on the `muban-template` and [`muban-webpack-scripts`](../../scripts/muban-webpack) can
be found on https://mubanjs.github.io/muban-skeleton/.

### Content Security Policy ([CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP))

This application has been build with a
[strict content security policy](https://csp.withgoogle.com/docs/strict-csp.html). To enforce this
policy add the following CSP header to the request response.

`Content-Security-Policy: script-src 'sha256-+OVgFCkyF2/rZ6qyfsNnIisCRI6dtMZw3w0Y4xiYagw=' 'strict-dynamic' https: 'unsafe-inline'; object-src 'none'; base-uri 'none';`

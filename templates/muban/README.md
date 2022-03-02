# muban-template [![downloads](https://badgen.now.sh/npm/dm/@pota/muban-template)](https://npmjs.org/package/@pota/muban-template)

## Setup 🚀

You can create a new project using [`create-pota`](https://github.com/mediamonks/pota/tree/main/core/create-pota).

```bash
npm init pota -- --template muban
```

> or use the shorthand, for the recommeded script setup

```bash
npm init pota muban
```

## Standards 📒

This project follows the
[Media.Monks Frontend Coding Standards](https://github.com/mediamonks/frontend-coding-standards).

## Documentation 📄

Documentation on the `muban-template` and [`muban-webpack-scripts`](../../scripts/muban-webpack) can
be found on https://mubanjs.github.io/muban-skeleton/.

### Content Security Policy ([CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP))

This application has been build with a
[strict content security policy](https://csp.withgoogle.com/docs/strict-csp.html). To enforce this
policy add the following CSP header to the request response.

`Content-Security-Policy: script-src 'sha256-+OVgFCkyF2/rZ6qyfsNnIisCRI6dtMZw3w0Y4xiYagw=' 'strict-dynamic' https: 'unsafe-inline'; object-src 'none'; base-uri 'none';`

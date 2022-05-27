# next-template [![downloads](https://badgen.now.sh/npm/dm/@pota/next-template)](https://npmjs.org/package/@pota/next-template)

## Setup 🚀

You can create a new project using
[`create-pota`](https://github.com/mediamonks/pota/tree/main/core/create-pota).

```bash
npm init pota -- --template next
```

> or use the `next` combination, for the recommeded setup

```bash
npm init pota next
```

## Standards 📒

This project follows the
[MediaMonks Frontend Coding Standards](https://github.com/mediamonks/frontend-coding-standards)

## Security 👮‍

### Ignore scripts
In order to mitigate NPM supply chain attacks by best effort the NPM [ignore-scripts](https://docs.npmjs.com/cli/v8/commands/npm-install#ignore-scripts) setting is enabled by default. This project
comes with a preconfigured set of dependencies that are allowed to run installation scripts.

After running `npm install` it is required to run `npm run postinstall` to run required installation scripts from dependent packages.

When adding a new dependency that requires an installation script to run make sure to add that package to the project `package.json` in the `postinstall` property.

> Important: After running `npm install` or `npm ci` always run `npm run postinstall` afterwards before running other scripts.

## Learn More

- [Pota Next Template](https://mediamonks.github.io/pota/templates/next.html) - learn about the
  Next.js Pota template.
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

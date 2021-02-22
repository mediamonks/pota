# Porter :tipping_hand_person:

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)](https://github.com/mediamonks/porter/tree/main/CONTRIBUTING.md)
[![CLI package](https://badge.fury.io/js/%40mediamonks%2Fporter.svg)](https://github.com/mediamonks/porter/tree/main/packages/porter)

_the CLI tool to carry your projects across the finish line and then some_

Porter is a tool for creating and managing project skeletons (scaffolds) and creating new projects from these skeletons.
[If you encounter any problems, please submit an issue.](https://github.com/mediamonks/porter/issues/new)

# 🚀 projects

If all you want is to quickly bootstrap a project with one of the builtin skeletons, you can use the `create` command.

```bash
# react skeleton
npx @mediamonks/porter create react my-react-app

# react base skeleton (basic structure, unopinionated, without extra dependencies)
npx @mediamonks/porter create react-base my-react-app

# vue skeleton
npx @mediamonks/porter create vue my-vue-app

```

| skeleton              | version                                                                                                                                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `react-skeleton`      | [![npm version](https://badge.fury.io/js/%40mediamonks%2Fporter-react-skeleton.svg)](https://github.com/mediamonks/porter/tree/main/packages/porter-react-skeleton)           |
| `react-base-skeleton` | [![npm version](https://badge.fury.io/js/%40mediamonks%2Fporter-react-base-skeleton.svg)](https://github.com/mediamonks/porter/tree/main/packages/porter-react-base-skeleton) |
| `vue-skeleton`        | [![npm version](https://badge.fury.io/js/%40mediamonks%2Fporter-vue-skeleton.svg)](https://github.com/mediamonks/porter/tree/main/packages/porter-vue-skeleton)               |

The `base` versions of the skeletons only have a basic development setup, don't contain anything additional are not opinionated. The standard versions expand on the `base` counterparts and include additional dependencies and a predefined project structure.

# 📚 skeletons & tools

A porter skeleton is split into the _skeleton_ and _tools_ packages.

## ☠️ Skeletons

Are responsible for defining the **structure, dependencies, scripts and the tools** used by the created project.

From a technical point of view, a skeleton is an NPM package containing a scaffold for a project and a `porter.ts` file that tells porter what to move from the skeleton to the project and how.

```ts
// ./my-new-skeleton/porter.ts

// /lib/authoring contains everything required to author a skeleton
import { PorterSkeleton } from "@mediamonks/porter/lib/authoring/skeleton";

// typeof import("./package.json") infers the types of your package.json
export default class Skeleton extends PorterSkeleton<typeof import("./package.json")> {
  // the tool the project will use
  tool = "@mediamonks/porter-react-tool";

  // the usable dependencies for the project
  dependencies = ["react", "react-dom", "web-vitals"] as const;

  // the usable development dependencies for the project
  devDependencies = [];

  // the scripts to carry over from the skeleton to the project
  scripts = ["check-types", "fix", "fix:eslint", "fix:prettier", "lint", "lint:eslint"] as const;

  // the tool related scripts to add to the project
  toolScripts = ["dev", "build", "serve"];

  // files to exclude from the skeleton
  // 'node_modules', 'package.json', 'porter.ts', 'tsconfig.tools.json' are excluded by default
  excludedFiles = [".eslintignore"];

  // file name and source transformations
  transformFiles = { gitignore: { name: ".gitignore" } };
}
```

## ⚒️ Tools

Are responsible for providing the **build system** for a skeleton and adding new **commands** to the porter CLI.

From a technical point of view, a tool is an NPM package containing a `porter` folder with TS scripts corresponding to commands.

```ts
// ./my-new-tool/porter/dev.ts

// string used to execute the command
export const command = "dev";

// optional, the description of the command, displayed when `--help` is passed
export const describe = "Start the development server";

// optional, additional optional or required arguments
export const builder = {
  /* arguments are nice */
};

// callback fired when the command is executed
export const handler = () => {
  /* do cool stuff */
};
```

# 💫 Migration

### `cra-template`

For those migrating from `cra-template`...

### `vue-skeleton`

For those migrating from `vue-skeleton`...

# 🙏 Contributing

We appreciate other great minds working Porter and making it better for all. See CONTRIBUTING.md for more information on how to get started.

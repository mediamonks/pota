# Porter - First Meeting

| -                                           | @vue/cli                              | create-react-app                                             | porter                                                                                                                                                                 |
| ------------------------------------------- | ------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| framework                                   | vue-specific                          | react-specific                                               | agnostic                                                                                                                                                               |
| build config                                | can be configured via presets/plugins | no official way of configuring                               | any build system can be configured through `tools` and each project can supply their own `webpack.config.ts`                                                           |
| skeleton/template definition                | can be defined via presets            | can be defined via templates                                 | can be defined via skeletons                                                                                                                                           |
| what I need to e.g. change the build config | learn how plugins/presets work        | fork react-scripts or use something like `react-app-rewired` | you can submit your own `webpack.config.ts` which can be completely separate from the `tools` and you only need to learn `porter` to build a new `skeleton` or `tools` |
| where do my templates come from             | single repo NPM package               | multi-repo NPM package                                       | multi-repo NPM package                                                                                                                                                 |
| updating                                    | wait for Vue team to do stuff or fork | wait for React team to do stuff or fork                      | full freedom                                                                                                                                                           |

---

## Why @vue/cli and CRA

We initially went with CRA and @vue/cli, because from past experiences with the `vue-skeleton`, we discovered that we do not have the time to maintain these skeletons. With `porter` this same "issue" will remain, however I am betting on MMs tooling side to improve this year, so we can dedicate more time to maintaining this.

---

## porter

```bash
npx @mediamonks/porter create react my-react-app

npx @mediamonks/porter create react-base my-base-react-app

npx @mediamonks/porter create vue my-vue-app
```

after creation projects can be built and started via

```bash
yarn build # build the project
yarn dev # start dev server

```

underneath these are

```bash
porter react build # build the project
porter vue build dev # start dev server

```

By itself porter is just a CLI that has two main responsibilities

1. create/bootstrap new projects from `skeletons`
2. using the `tools` packages to extend the CLI with e.g. `build` and `dev` commands

---

### porter-skeleton

Basically exactly what we would have with the `vue-skeleton`, minus everything build related. There is no specific format definition, the `skeleton` is meant to look basically the same as when you create a new project from it.

There are a few exceptions:

- files that NPM isn't happy about, such as `.gitignore`
- the `porter.ts` file which describes a series of functions that allow `porter create` to synchronize all of the skeleton related items into a new project

---

### porter-tools

The `tools` packages can be anything and everything only requirement is to have a `porter.ts` file that exports a `decorate` function.

The `decorate` function, is meant to be used to decorate the `porter` CLI with additional commands.

e.g. the `porter-webpack-tools` decorate the CLI with `build` and `dev` commands. `porter-react-tools` and `porter-vue-tools` simply re-export this same function, but provide a different `webpack.config.ts` containing framework specific tweaks.

# Authoring Commands

To get started, create a `pota.commands.js` (filename can differ) file in your project where
`@pota/cli` is installed. Then set it as a source:

```bash
npm pkg set pota="pota.commands.js"
```

Now, depending on your use-case, you can either define [Function Commands](#function-commands)
and/or [Class Commands](#class-commands).

## Function Commands

A **Function Command** is the simplest form of a Pota command; a function exported from the command
source file (`pota.commands.js` in this example) is interpreted as a command.

> Let's export a function from `pota.commands.js`

```js
// pota.commands.js
export function sayHelloWorld(args) {
  console.log(`Hello World, ${args[0]}`);
}
```

> Output of `npx pota --help` should match the below

```bash
$ npx pota --help

  Usage
    $ pota <command> [options]

  Available Commands
    say-hello-world

  For more info, run any command with the `--help` flag
    $ pota say-hello-world --help

  Options
    -v, --version    Displays current version
    -h, --help       Displays this message
```

> Running the command

```bash
npx pota say-hello-world Pota
Hello World, Pota
```

### Limitations

- the command **name** is inferred from the function name and transformed using
  [param-case](https://npmjs.org/package/param-case)
- no way to define a command **description**
- no way to define command **options**; only non-flag options are passed as an array as the first
  argument to the function
  - ✅ `these`, `are`, `valid`, `options`
  - ❌ `--this`, `--will`, `--not`, `--work`
- not **extensible**
- no way to define **dependencies**

## Class Commands

**Class Commands** serve to fill in the limitations of [Function Commands](#function-commands).

```js
// pota.commands.js
export class SayHelloWorld {
  /*
   * The name that is used to call the command: `npx pota hello-world`
   */
  name = 'hello-world';
  /*
   * The description of the command displayed when the `--help` flag is passed
   */
  description = 'Say Hello World';
  /*
   * The custom options that will be parsed from the passed arguments
   */
  options() {
    return {
      goodbye: {
        // will be displayed when calling `npx pota hello-world --help`
        description: 'Will instead say Goodbye',
        // will be displayed when calling `npx pota hello-world --help`
        default: false,
      },
    };
  }

  /*
   * The action of the command, a function that is executed when the command is called.
   *
   * @param options - the arguments passed when calling the command, parsed using the `options()`,
   *                  function defined above. The `_` field contains the options which haven't
   *                  been mapped to a specific option.
   *
   * @returns - void | Promise<void>
   */
  action(options) {
    const args = options._;
    console.log(`Hello World, ${args[0]}`);
  }
}
```

> Running `npx pota --help`, we should now the see **name** and **description**:

```bash
$ npx pota --help

  Usage
    $ pota <command> [options]

  Available Commands
    hello-world    Say Hello World

  For more info, run any command with the `--help` flag
    $ pota hello-world --help
```

> Running `npx pota hello-world --help`, we should see the available **options**:

```bash
$ npx pota hello-world --help

  Description
    Say Hello World

  Usage
    $ pota hello-world [options]

  Options
    --goodbye     Will instead say Goodbye  (default false)
    -h, --help    Displays this message
```

> The newly added option in action:

```bash
npx pota hello-world --goodbye Pota
Goodbye World, Pota
```

To see how to define **dependencies** and how they function with extending, see
[Dependencies](docs/dependencies.md).

## Authoring Commands with TypeScript

TODO

## Authoring Command Packages

TODO; for now see [Scripts](../../../scripts).

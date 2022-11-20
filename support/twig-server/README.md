# @pota/twig-server [![version](https://img.shields.io/npm/v/@pota/twig-server.svg?label=%20)](https://npmjs.org/package/@pota/twig-server)

A Node.js server to render twig templates, supporting the muban-template. It allows you to easily start this package
on your server without installing any dependencies (besides node and npm).

You can extend the Twig Environment to add custom filters and functions.

## Usage

Running the server directly:

```bash
npx @pota/twig-server
```

Or using the API:

```bash
npm i -D @pota/twig-server
```
```js
import path from 'path';
import { URL } from 'url';
import { createServer } from '@pota/twig-server';

createServer({
  mountPath: '/template',
  host: 'localhost',
  port: '9003',
  useUnixSocket: false,
  socketPath: path.resolve(new URL('.', import.meta.url).pathname, './twig-socket'),
  templateDir: path.resolve(new URL('.', import.meta.url).pathname, '../templates'), 
  extensionPath: path.resolve(new URL('.', import.meta.url).pathname, './twig-extensions.cjs'),
});
```

Or using the middleware on an existing server:

```js
import express from 'express'

import { createTwigMiddleWare } from '@pota/twig-server';

const app = express();

// add default middleware
app.use('/component-templates/', createTwigMiddleware());

// or with options
app.use('/component-templates/', createTwigMiddleware('/templates', {
  extensionPath: path.resolve(new URL('.', import.meta.url).pathname, './twig-extensions.cjs'),
}));

app.listen(9002, 'localhost', () => {
  console.info(`http://localhost:9002/component-templates/`);
});
```
## Options

Server options:
* `mountPath?: string [/component-templates]` - On what path the template endpoint should be mounted.
  All configured template endpoints will be prefixed by this path.
* `useUnixSocket?: boolean [false]` - Whether to use a unix socket to start the server instead of the default 
  `host:port`.
* `socketPath?: string [./socket]` - Where to create the unix socket.
* `host?: string [localhost]` - What port to use.
* `port?: number [9003]` - What host to use.

Middleware options:
* `templateDir?: string [./templates]` - Where the twig template files can be found.
* `extensionPath?: string` - A path to a file that exports an `addExtensions` function to enhance the Twig Environment.

  ```js
  
  // the 2nd parameters exposes the 'twing' import,
  // so you don't have to import it yourself, and the same instance is shared
  export function addExtensions(env, { TwingFunction, TwingFilter }) {
    env.addFunction(new TwingFunction(...));
    env.addFilter(new TwingFilter(...));
  }
  ```
  
  More information can be found in the [Twing docs](https://nightlycommit.github.io/twing/advanced.html).


## CLI usage

```
Usage: twig-server [options]

Server options:
  -m, --mount-path   On what path the template endpoint should be mounted. Anything after this path will count as the co
                     mponent path/id                                          [string] [default: "/component-templates"]
  -h, --host         The host that will be used to run the server, passed to `app.listen`[string] [default: "localhost"]
  -p, --port         The port that will be used to run the server, passed to `app.listen`       [number] [default: 9003]
  -u, --unix-socket  Whether to use a unix socket to start the server instead of the default `host:port`.      [boolean]
  -s, --socket-path  Where to create the unix socket. Only needed when `unix-socket` is true.                   [string]

Middleware options:
  -d, --template-dir    Where the twig template files can be found.                    [string] [default: "./templates"]
  -e, --extension-path  A path to a file that exports an `addExtensions` function to enhance the Twig Environment.
                                                                                                                [string]

Options:
      --help  Show help                                                                                        [boolean]

Examples:
  twig-server                           Start a server on default host and port.
  twig-server -h localhost -p 9002      Start a server on a specific host and port
  twig-server -u -s ./twig-socket       Start a server connected to the socket at that location
  twig-server -m component-template     Make all template routes available on the "component-template/" path.
  twig-server -d ./templates            Specify a folder where the template files are located.
  twig-server -e ./twig-extensions.cjs  Provide a file to enhance the Twig Environment.
```
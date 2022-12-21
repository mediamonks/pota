# @pota/twig-server [![version](https://img.shields.io/npm/v/@pota/twig-server.svg?label=%20)](https://npmjs.org/package/@pota/twig-server)

A Node.js server to render twig templates, supporting the muban-template. It allows you to easily
start this package on your server without installing any dependencies (besides node and npm).

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
  cors: true,
});
```

Or using the middleware on an existing server:

```js
import express from 'express';

import { createTwigMiddleWare } from '@pota/twig-server';

const app = express();

// add default middleware
app.use('/component-templates/', createTwigMiddleware());

// or with options
app.use(
  '/component-templates/',
  createTwigMiddleware('/templates', {
    extensionPath: path.resolve(new URL('.', import.meta.url).pathname, './twig-extensions.cjs'),
  }),
);

app.listen(9002, 'localhost', () => {
  console.info(`http://localhost:9002/component-templates/`);
});
```

## Options

Server options:

- `mountPath?: string [/component-templates]` - On what path the template endpoint should be
  mounted. All configured template endpoints will be prefixed by this path.
- `useUnixSocket?: boolean [false]` - Whether to use a unix socket to start the server instead of
  the default `host:port`.
- `socketPath?: string [./socket]` - Where to create the unix socket.
- `host?: string [localhost]` - What port to use.
- `port?: number [9003]` - What host to use.
- `cors?: boolean [false]` - Whether to enable cors for the created server, so it accepts requests
  from other origins.

Middleware options:

- `templateDir?: string [./templates]` - Folder where the twig template files can be found, can pass
  multiple, it tries them in order.
- `extensionPath?: string` - A path to a file that exports an `addExtensions` function to enhance
  the Twig Environment.

  ```js
  // the 2nd parameters exposes the 'twing' import,
  // so you don't have to import it yourself, and the same instance is shared
  export function addExtensions(env, { TwingFunction, TwingFilter }) {
    env.addFunction(new TwingFunction(...));
    env.addFilter(new TwingFilter(...));
  }
  ```

  More information can be found in the
  [Twing docs](https://nightlycommit.github.io/twing/advanced.html).

## CLI usage

````
Usage: twig-server [options]

Server options:
  -m, --mount-path   On what path the template endpoint should be mounted. Anything after this path will count as the co
                     mponent path/id                                          [string] [default: "/component-templates"]
  -h, --host         The host that will be used to run the server, passed to `app.listen`[string] [default: "localhost"]
  -p, --port         The port that will be used to run the server, passed to `app.listen`       [number] [default: 9003]
  -u, --unix-socket  Whether to use a unix socket to start the server instead of the default `host:port`.      [boolean]
  -s, --socket-path  Where to create the unix socket. Only needed when `unix-socket` is true.                   [string]
  -c, --cors         Whether to enable cors for the created server, so it accepts requests from other origins. [boolean]

Middleware options:
  -d, --template-dir    Folder where the twig template files can be found, can pass multiple, it tries them in order.
                                                                                        [array] [default: "./templates"]
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
  twig-server -c                        Enable cors when starting the server.```

## Template Rendering

To render a twig template, the server needs to know two things;

1. what template to render
2. what data to pass to the template

All this information should exist in the request, and there are multiple ways to pass this.
Currently we're not support all thinkable use cases, but can expand if the currently supported options
give issues.

### Template ID

This server currently supports one method of getting the component path/id from there request, using the url pathname.

It expects the component filename and folder name to be the same.

````

# request

GET /component-templates/atoms/button

# will load from disk

/templates/atoms/button/button.twig

```

### Template Data

This server currently supports two methods of pulling data from there request, and using that to render the template:

* from individual query parameters
* from the `templateData` query parameter as a encoded JSON string

The benefit of the latter option is that it supports actual booleans and numbers, and makes nesting `arrays` and
`objects` easier.

### Individual query parameters

```

# example

/component-templates/atoms/button?copy=Hello+World&ref=cta&active=true

````

Will use parameters
```json
{
  "copy": "Hello World",
  "ref": "cta",
  "active": "true"
}
````

> **Note** that the `active` `boolean` is actually a `string`, since everything is a string in the
> URL.

### templateData JSON

To have more control over the structure and the types of your template data, a nicer way to pass
this is to use JSON. The server checks for the `templateData` query parameter, and if that's a
string, it parses the JSON, and uses that to render the template.

```
# example
/component-templates/atoms/button?templateData={"copy":"Hello World","ref":"cta","active":true}
```

Will use parameters

```json
{
  "copy": "Hello World",
  "ref": "cta",
  "active": true
}
```

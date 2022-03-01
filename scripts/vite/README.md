# vite-scripts [![downloads](https://badgen.now.sh/npm/dm/@pota/vite-scripts)](https://npmjs.org/package/@pota/vite-scripts)

## Commands

#### **`build`** - builds the source using `vite`.

```bash
npm run build # or npx pota build
```

| Option            | Type                                        | Default  | Description                                                            |
| ----------------- | ------------------------------------------- | -------- | ---------------------------------------------------------------------- |
| **`debug`**       | `{Boolean}`                                 | `false`  | Sets NODE_ENV to 'development'.                                        |
| **`watch`**       | `{Boolean}`                                 | `false`  | Run build and watch for changes.                                       |
| **`output`**      | `{String}`                                  | `./dist` | The build output directory.                                            |
| **`source-map`**  | `{Boolean}`                                 | `false`  | Enable source-map generation                                           |
| **`force`**       | `{Boolean}`                                 | `false`  | Ignore pre-bundled dependencies (the node_modules/.vite cache).        |
| **`public-path`** | `{String}`                                  | `/`      | The location of static assets on your production server.               |
| **`log-level`**   | `{'info' \| 'warn' \| 'error' \| 'silent'}` | `info`   | Adjust console output verbosity. (https://vitejs.dev/config/#loglevel) |

<br />

#### **`dev`** - starts the development service using `vite`.

```bash
npm run dev # or npx pota dev
```

| Option            | Type                                        | Default    | Description                                                                                     |
| ----------------- | ------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------- |
| **`https`**       | `{Boolean}`                                 | `false`    | Enables the server's listening socket for TLS (by default, dev server will be served over HTTP) |
| **`open`**        | `{Boolean}`                                 | `true`     | Allows to configure dev server to open the browser after the server has been started.           |
| **`host`**        | `{String \| Boolean}`                       | `127.0.01` | Specify which IP addresses the server should listen on.                                         |
| **`port`**        | `{Number}`                                  | `2001`     | Allows configuring the port.                                                                    |
| **`cors`**        | `{ Boolean }`                               | `false`    | Enables CORS.                                                                                   |
| **`prod`**        | `{Boolean}`                                 | `false`    | Sets NODE_ENV to 'production'.                                                                  |
| **`force`**       | `{Boolean}`                                 | `false`    | Ignore pre-bundled dependencies (the node_modules/.vite cache).                                 |
| **`public-path`** | `{String}`                                  | `/`        | The location of static assets on your production server.                                        |
| **`log-level`**   | `{'info' \| 'warn' \| 'error' \| 'silent'}` | `info`     | Adjust console output verbosity. (https://vitejs.dev/config/#loglevel)                          |

#### **`preview`** - locally preview the production build using `vite`.

```bash
npm run preview # or npx pota preview
```

| Option            | Type                                        | Default    | Description                                                                                     |
| ----------------- | ------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------- |
| **`https`**       | `{Boolean}`                                 | `false`    | Enables the server's listening socket for TLS (by default, dev server will be served over HTTP) |
| **`open`**        | `{Boolean}`                                 | `true`     | Allows to configure dev server to open the browser after the server has been started.           |
| **`host`**        | `{String \| Boolean}`                       | `127.0.01` | Specify which IP addresses the server should listen on.                                         |
| **`port`**        | `{Number}`                                  | `2001`     | Allows configuring the port.                                                                    |
| **`cors`**        | `{Boolean}`                                 | `false`    | Enables CORS.                                                                                   |
| **`force`**       | `{Boolean}`                                 | `false`    | Ignore pre-bundled dependencies (the node_modules/.vite cache).                                 |
| **`public-path`** | `{String}`                                  | `/`        | The location of static assets on your production server.                                        |
| **`log-level`**   | `{'info' \| 'warn' \| 'error' \| 'silent'}` | `info`     | Adjust console output verbosity. (https://vitejs.dev/config/#loglevel)                          |

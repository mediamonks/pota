# react-webpack-scripts [![downloads](https://badgen.now.sh/npm/dm/@pota/react-webpack-scripts)](https://npmjs.org/package/@pota/react-webpack-scripts)

### Commands

#### **`build`** - builds the source using `webpack`.

```bash
npm run build # or npx pota build
```

| Option                  | Type                                                                          | Default                                                    | Description                                                                                                                                      |
| ----------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`analyze`**           | `{Boolean}`                                                                   | `false`                                                    | When enabled, will open a bundle report after bundling.                                                                                          |
| **`cache`**             | `{Boolean}`                                                                   | `true`                                                     | Toggles webpack's [caching](https://webpack.js.org/configuration/cache/) behavior.                                                               |
| **`image-compression`** | `{Boolean}`                                                                   | `true`                                                     | Toggles image compression.                                                                                                                       |
| **`debug`**             | `{Boolean}`                                                                   | `false`                                                    | Sets NODE_ENV to 'development'.                                                                                                                  |
| **`watch`**             | `{Boolean}`                                                                   | `false`                                                    | Run build and watch for changes.                                                                                                                 |
| **`output`**            | `{String}`                                                                    | `./dist`                                                   | The build output directory.                                                                                                                      |
| **`source-map`**        | `{false\|`[devtool](https://webpack.js.org/configuration/devtool/#devtool)`}` | `source-map` (production), `eval-source-map` (development) | Sets the style of source-map, for enhanced debugging. Disable or use faster options in you are having out of memory or other performance issues. |
| **`public-path`**       | `{String}`                                                                    | `/`                                                        | The location of static assets on your production server.                                                                                         |
| **`typecheck`**         | `{Boolean}`                                                                   | `true`                                                     | When disabled, will ignore type related errors.                                                                                                  |
| **`versioning`**        | `{Boolean}`                                                                   | `false`                                                    | When enabled, will copy assets in `./static` to a versioned directory in the output (e.g. `build/version/v2/static/...`).                        |
| **`profile`**           | `{Boolean}`                                                                   | `false`                                                    | Toggles support for the React Devtools in **production**.                                                                                        |

<br />

#### **`dev`** - starts the development service using `webpack-dev-server`.

```bash
npm run dev # or npx pota dev
```

| Option                  | Type                                                                          | Default                                                    | Description                                                                                                                                      |
| ----------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`cache`**             | `{Boolean}`                                                                   | `true`                                                     | Toggle webpack's [caching](https://webpack.js.org/configuration/cache/) behavior.                                                                |
| **`https`**             | `{Boolean}`                                                                   | `false`                                                    | Run the development server with HTTPS.                                                                                                           |
| **`open`**              | `{Boolean}`                                                                   | `true`                                                     | Allows to configure dev server to open the browser after the server has been started.                                                            |
| **`port`**              | `{Number}`                                                                    | `2001`                                                     | Allows configuring the port.                                                                                                                     |
| **`image-compression`** | `{Boolean}`                                                                   | `true`                                                     | Toggles image compression.                                                                                                                       |
| **`prod`**              | `{Boolean}`                                                                   | `false`                                                    | Sets NODE_ENV to 'production'.                                                                                                                   |
| **`source-map`**        | `{false\|`[devtool](https://webpack.js.org/configuration/devtool/#devtool)`}` | `source-map` (production), `eval-source-map` (development) | Sets the style of source-map, for enhanced debugging. Disable or use faster options in you are having out of memory or other performance issues. |
| **`typecheck`**         | `{Boolean}`                                                                   | `true`                                                     | Toggles checking for type related errors.                                                                                                        |

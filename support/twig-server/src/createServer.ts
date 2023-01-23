import fs from 'fs';
import path from 'path';
import type { Express } from 'express';
import express from 'express';
import cors from 'cors';

import { resolve } from 'path';
import qs from 'qs';
import { getTwigMiddleware } from './getTwigMiddleware.js';

import * as url from 'url';
import type { ServerOptions } from './types.js';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const DEFAULT_SERVER_OPTIONS: Required<Omit<ServerOptions, 'ignore' | 'extensionPath'>> = {
  mountPath: '/component-templates',
  host: 'localhost',
  port: 9003,
  useUnixSocket: false,
  socketPath: resolve(process.cwd(), './socket'),
  templateDir: './templates',
  cors: false,
};

export function createServer(serverOptions: ServerOptions = {}): Express {
  const {
    templateDir,
    socketPath,
    useUnixSocket,
    host,
    port,
    cors: corsEnabled,
    ...middlewareOptions
  } = {
    ...DEFAULT_SERVER_OPTIONS,
    // clear out undefined value to not override the default options
    ...(Object.fromEntries(
      Object.entries(serverOptions).filter(([, v]) => v !== undefined),
    ) as ServerOptions),
  };

  const { version } =
    JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8')) ?? {};
  console.log(`Starting twig-server version ${version}.

With options:
- Template dir(s): ${JSON.stringify(templateDir, null, 2)}
- Extension path: ${middlewareOptions.extensionPath ?? 'not set'}
- Cors enabled: ${corsEnabled}
`);

  // remove trailing /
  const mountPath = middlewareOptions.mountPath.replace(/\/$/, '');

  const app = express();
  app.set('query parser', (path: string) => qs.parse(path, { depth: 10 }));

  if (corsEnabled) {
    app.use(cors());
  }

  app.use(mountPath, getTwigMiddleware(templateDir, { ...middlewareOptions }));

  // return 404 response to unmatched routes under the mount path
  app.use(mountPath, (req, res) => res.sendStatus(404));

  if (useUnixSocket) {
    // clean up previous socket connection
    if (fs.existsSync(socketPath)) {
      fs.unlinkSync(socketPath);
    }

    app.listen(socketPath, () => {
      console.info(`Running on http://unix:${socketPath}`);

      // give nginx permission to use this
      fs.chmodSync(socketPath, 0o666);
    });
  } else {
    app.listen(port, host, () => {
      console.info(`Running on http://${host}:${port}${mountPath || '/'}`);
    });
  }

  return app;
}

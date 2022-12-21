import fs from 'fs';
import path from 'path';
import type { Express } from 'express';
import express from 'express';
import cors from 'cors';

import { resolve } from 'path';
import { getTwigMiddleware, TemplateOptions } from './getTwigMiddleware.js';

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export type ServerOptions = TemplateOptions & {
  mountPath?: string;
  useUnixSocket?: boolean;
  socketPath?: string;
  host?: string;
  port?: number;
  templateDir?: string | Array<string>;
  cors?: boolean;
};

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
- Template dir(s): ${templateDir}
- Extension path: ${middlewareOptions.extensionPath ?? 'not set'}
- Cors enabled: ${corsEnabled}
`);

  // remove trailing /
  const mountPath = middlewareOptions.mountPath.replace(/\/$/, '');

  const app = express();

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

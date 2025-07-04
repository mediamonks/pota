import bodyParser from 'body-parser';
import type { NextFunction, Request, Response } from 'express-serve-static-core';
import { basename, dirname, join, resolve } from 'path';
import { DEFAULT_SERVER_OPTIONS } from './createServer.js';
import type { TemplateDirConfig, TemplateOptions } from './types.js';
import { normalizeTemplateDirs } from './utils/normalizeTemplateDirs.js';

const exampleCodeExport = `export default {
  title: 'MyComponent',
  argTypes: {
    ...
  },
  parameters: {
    server: {
      id: 'atoms/my-component',
    },
  },
};`;

const exampleCodeComponent = `export const Default: Story<MyComponentProps> = {
  render: () => ({
    component: MyComponent,
  }),
  parameters: {
    server: {
      id: 'atoms/my-component',
    },
  },
};`;

async function parseBody(req: Request, res: Response) {
  return new Promise<void>((resolve) => {
    bodyParser.json()(req, res, () => {
      resolve();
    });
  });
}

export function getTwigMiddleware(
  templateDir: TemplateDirConfig = DEFAULT_SERVER_OPTIONS.templateDir,
  options: TemplateOptions = {},
) {
  const normalizedDirs = normalizeTemplateDirs(templateDir);
  const absTemplatePaths = normalizedDirs.map(([dir, ns]) => [
    resolve(process.cwd(), dir),
    ns,
  ]) as Array<[string, string?]>;

  const absExtensionPath = resolve(process.cwd(), options.extensionPath ?? './');

  return async function twigMiddleware(req: Request, res: Response, next: NextFunction) {
    await parseBody(req, res);

    // Explicitly create a new Twig environment on each request,
    // otherwise it'll cache all the templates
    const twingExport = await import('twing');
    const { TwingEnvironment, TwingLoaderFilesystem } = twingExport;

    const loader = new TwingLoaderFilesystem();
    absTemplatePaths.forEach((options) => {
      loader.addPath(...options);
    });

    const env = new TwingEnvironment(loader, {
      cache: false,
      auto_reload: true,
    });

    // Add filters or functions to the Twig Environment
    if (options.extensionPath) {
      (await import(absExtensionPath)).addExtensions(env, twingExport);
    }

    const templateId = req.body?.templateId ?? req.query.templateId ?? req.path.substring(1);
    const componentName = basename(templateId);
    const templatePath = options.flattenPath
      ? join(dirname(templateId), `${componentName}.html.twig`)
      : join(dirname(templateId), componentName, `${componentName}.html.twig`);

    try {
      const templateData =
        req.body?.templateData ??
        ('templateData' in req.query && typeof req.query.templateData === 'string'
          ? JSON.parse(req.query.templateData)
          : req.query);

      const result = await env.render(templatePath, templateData);
      res.send(result);
    } catch (e: any) {
      if (e.message.includes('Unable to find template')) {
        const msg = `
            <h2>Could not find template "${componentName}"</h2>
            <p>Looking for <b><code>${req.path}</code></b> resolved at <code><b>${
          /"([^"]+)"/gi.exec(e.message)?.[1]
        }</b></code></p>
            <p>Please look at your story parameters to make sure it includes the path to the component folder, like:</p>
            <pre><code>${exampleCodeExport}</code></pre>
            <p>Or for individual stories:</p>
            <pre><code>${exampleCodeComponent}</code></pre>
          `;
        res.send(msg);
      } else {
        const msg = `
            <p>${e.message}</p>
            <pre><code>${e.stack}</code></pre>
          `;
        res.send(msg);
      }
    }
  };
}

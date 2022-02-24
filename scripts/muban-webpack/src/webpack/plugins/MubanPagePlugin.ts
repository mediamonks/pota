import { readFile } from 'fs/promises';

import type { Compiler, WebpackPluginInstance, sources } from 'webpack';
import requireFromString from 'require-from-string';

import type { Constructor } from '../types.js';
import { isFunction, isString } from 'isntnt';

const NS = 'MubanPagePlugin';

type Attributes = Record<string, unknown>;

function stringifyAttributes(attributes: Attributes) {
  return Object.entries(attributes)
    .map(([key, value]) => `${String(key)}="${String(value)}"`)
    .join(' ');
}

function convertObjectsToTags(
  objectOrArray: Attributes | ReadonlyArray<Attributes>,
  tag: 'link' | 'meta',
) {
  const arr = Array.isArray(objectOrArray) ? objectOrArray : [objectOrArray];

  switch (tag) {
    case 'link':
      return arr.map((attributes) => `<link ${stringifyAttributes(attributes)} />`);
    case 'meta':
      return arr.map((attributes) => `<meta ${stringifyAttributes(attributes)} >`);
    default:
      return [];
  }
}

function replaceTemplateVars(template: string, variables: Record<string, string> = {}) {
  let updatedTemplate = String(template);

  for (const [key, value] of Object.entries(variables)) {
    updatedTemplate = updatedTemplate.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }

  return updatedTemplate;
}

function replaceTemplateTitle(template: string, title: string) {
  return template.replace(/<title>(.*?)<\/title>/, (match, g0) => match.replace(g0, title));
}

function insertHeadTags(template: string, headTags: ReadonlyArray<unknown>) {
  const headClosingTagIndex = template.indexOf('</head>');

  const beforeHeadClosingTag = template.slice(0, headClosingTagIndex);
  const afterHeadClosingTag = template.slice(headClosingTagIndex); // includes the head closing tag

  return [beforeHeadClosingTag, ...headTags, afterHeadClosingTag].join('\n');
}

type MubanPagePluginOptions = {
  template: string;
};

export default class MubanPagePlugin implements WebpackPluginInstance {
  private cache = new WeakMap();

  constructor(private options: MubanPagePluginOptions) {}

  apply(compiler: Compiler) {
    const { webpack } = compiler;
    const { sources, Compilation } = webpack;

    // Specify the event hook to attach to
    compiler.hooks.thisCompilation.tap(NS, (compilation) => {
      compilation.hooks.processAssets.tapPromise(
        { name: NS, stage: Compilation.PROCESS_ASSETS_STAGE_DERIVED },
        async (assets) => {
          const [chunk] = compilation.chunks;
          const [file] = chunk.files;

          const asset = assets[file];

          if (!this.cache.has(asset)) {
            const compilationHash = compilation.hash;

            const publicPath = compilation.getAssetPath(
              compilation.outputOptions.publicPath ?? '/',
              {
                hash: compilationHash,
              },
            );

            try {
              const pageAssets = await this.generatePageAssets(
                asset.source() as string,
                publicPath,
                sources.RawSource,
              );

              this.cache = new WeakMap();
              this.cache.set(asset, pageAssets);
            } catch (error) {
              console.log();
              console.error(`Error settings new page assets:`);
              console.error(error);
            }
          }

          for (const [page, source] of this.cache.get(asset)) {
            assets[page] = source;
          }
        },
      );
    });
  }

  private cachedTemplate: string | undefined = undefined;
  async getHtmlTemplate() {
    this.cachedTemplate =
      this.cachedTemplate ?? (await readFile(this.options.template, { encoding: 'utf-8' }));
    return this.cachedTemplate;
  }

  private async generatePageAssets(
    contextSource: string,
    publicPath: string,
    RawSource: Constructor<sources.RawSource>,
  ) {
    const { pages, appTemplate } = this.getContextModule(contextSource);

    const htmlTemplate = await this.getHtmlTemplate();

    return Object.entries(pages)
      .map(([page, m]) => {
        const asset = `${page}.html`;

        try {
          let pageTemplate = replaceTemplateVars(htmlTemplate, {
            content: appTemplate(m.data?.() ?? {}),
            publicPath,
          });

          if ('title' in m && isString(m.title)) {
            pageTemplate = replaceTemplateTitle(pageTemplate, m.title);
          }

          const newHeadTags = [];

          if ('meta' in m && isFunction(m.meta)) {
            newHeadTags.push(...convertObjectsToTags(m.meta(), 'meta'));
          }
          if ('link' in m && isFunction(m.link)) {
            newHeadTags.push(...convertObjectsToTags(m.link(), 'link'));
          }

          if (newHeadTags.length > 0) pageTemplate = insertHeadTags(pageTemplate, newHeadTags);

          return [asset, new RawSource(pageTemplate)];
        } catch (error) {
          console.log();
          console.error(`Error occurred processing "${asset}":`);
          console.error(error);
          return null;
        }
      })
      .filter(Boolean);
  }

  private getContextModule(source: string): {
    pages: Record<
      string,
      {
        data?: () => Record<string, unknown>;
        title?: string;
        meta?: () => Record<string, unknown>;
        link?: () => Record<string, unknown>;
      }
    >;
    appTemplate: (data: Record<string, unknown>) => string;
  } {
    const fallback = { pages: {}, appTemplate: () => '' };

    try {
      return { ...fallback, ...requireFromString(source) };
    } catch (error) {
      console.error(error);

      return fallback;
    }
  }
}

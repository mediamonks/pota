import type { IndexHtmlTransformResult, Plugin } from 'vite';

export function injectEntryTagPlugin(entryPath: string): Plugin {
  return {
    name: 'inject-entry-tag',
    transformIndexHtml: {
      enforce: 'pre' as const,
      transform(): IndexHtmlTransformResult {
        return [
          {
            tag: 'script',
            attrs: { type: 'module', src: entryPath },
          },
        ];
      },
    },
  };
}

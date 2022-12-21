import type { TemplateDirConfig } from '../types.js';

export function normalizeTemplateDirs(config: TemplateDirConfig): Array<[string, string?]> {
  if (typeof config === 'string') {
    return [[config]];
  }

  // record
  if (typeof config === 'object' && !Array.isArray(config)) {
    return Object.entries(config as Record<string, string>).map(([namespace, path]) => [
      path,
      namespace,
    ]);
  }
  // array
  return config.map(
    (item) =>
      // remove outer wrapper, we don't need that when these exist in an array.
      normalizeTemplateDirs(item)[0],
  );
}

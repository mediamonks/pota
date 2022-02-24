import { relative, resolve, isAbsolute } from 'path';

export async function loadDependencies(
  dependencyPaths: Record<string, string | ReadonlyArray<string>>,
  root: string,
  options: unknown,
) {
  const pathEntries = Object.entries(dependencyPaths);

  const loadedDependencies: Record<string, unknown> = {};

  for (const [dependency, path] of pathEntries) {
    const paths = (Array.isArray(path) ? path : [path]).map((p) =>
      isAbsolute(p) ? p : resolve(root, p),
    );

    let error: Error | null = null;
    for (const path of paths) {
      try {
        loadedDependencies[dependency] = (await import(path as string)).default(options);
        if (loadedDependencies[dependency]) break;
      } catch (error) {
        if ((error as { code: 'ERR_MODULE_NOT_FOUND' }).code !== 'ERR_MODULE_NOT_FOUND') {
          console.warn(`Error loading dependency '${relative(root, path)}':`);
          console.warn((error as Error).message || error);
        } else error = error;
      }
    }

    if (!loadedDependencies[dependency] && error) {
      console.error((error as Error).message || error);
    }
  }

  return loadedDependencies;
}

import { relative } from 'path';
import { pathToFileURL } from 'url';
import type DevServer from 'webpack-dev-server';
import type { Middleware } from 'webpack-dev-server';

type ProxySetupFunction = (server: DevServer['app']) => Middleware;

export async function loadProxySetup(path: string): Promise<ProxySetupFunction | null> {
  try {
    const setup: ProxySetupFunction | undefined = (await import(pathToFileURL(path).toString()))
      .default;

    if (typeof setup !== 'function') {
      throw new Error(`"${relative(process.cwd(), path)}" should export default a function.`);
    }

    return setup;
  } catch (error) {
    if ((error as { code?: string }).code !== 'ERR_MODULE_NOT_FOUND') console.warn(error);

    return null;
  }
}

import { createLogger } from './createLogger.js';
import type { Configuration, Compiler } from 'webpack';

export async function createCompiler(
  config: Configuration | ReadonlyArray<Configuration>,
): Promise<Compiler | null> {
  const webpack = (await import('webpack')).default;
  const log = await createLogger();
  const { red } = log.color;

  try {
    return webpack(config as Configuration);
  } catch (error) {
    log(red('Failed to initialize compiler.'));
    log();
    log.error((error as Error).message || error);
    log();

    return null;
  }
}

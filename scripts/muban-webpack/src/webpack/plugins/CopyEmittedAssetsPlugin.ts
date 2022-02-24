import { join, dirname } from 'path';
import { access, mkdir, writeFile } from 'fs/promises';

import type { Compiler, WebpackPluginInstance } from 'webpack';

const NS = 'CopyEmittedAssetsPlugin';

export default class CopyEmittedAssetsPlugin implements WebpackPluginInstance {
  public constructor(private filter: RegExp, private outputPath: string) {}

  public apply(compiler: Compiler) {
    compiler.hooks.assetEmitted.tapPromise(NS, async (file, { content }) => {
      if (!this.filter.test(file)) return;

      const newPath = join(this.outputPath, file);
      const newPathDir = dirname(newPath);

      try {
        // check if the directory of the new path is accessible (i.e. exists)
        await access(newPathDir);
      } catch {
        // assume that the directory does not exist and recursively create it
        await mkdir(newPathDir, { recursive: true });
      } finally {
        // write the file to the new path
        await writeFile(newPath, content);
      }
    });
  }
}

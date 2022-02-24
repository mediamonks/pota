import type { Compiler, WebpackPluginInstance } from 'webpack';

const NS = 'EmitMockMainPlugin';

export default class EmitMockMainPlugin implements WebpackPluginInstance {
  get source() {
    return `
import { execSync } from "child_process";

execSync('npx @mediamonks/monck -u', { stdio: [0, 1, 2] });
  `;
  }

  apply(compiler: Compiler) {
    const { webpack } = compiler;
    const { Compilation, sources } = webpack;

    compiler.hooks.thisCompilation.tap(NS, (compilation) => {
      compilation.hooks.processAssets.tap(
        { name: NS, stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL },
        (assets) => {
          assets['main.mjs'] = new sources.RawSource(this.source);
        },
      );
    });
  }
}

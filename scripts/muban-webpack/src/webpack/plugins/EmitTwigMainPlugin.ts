import type { Compiler, WebpackPluginInstance } from 'webpack';

const NS = 'EmitTwigMainPlugin';

export default class EmitTwigMainPlugin implements WebpackPluginInstance {
  get source() {
    return `
import { execSync } from "child_process";

execSync('npx @pota/twig-server -u -s /twig-socket -e ./extensions/twig-extensions.cjs', { stdio: [0, 1, 2] });
  `;
  }

  apply(compiler: Compiler) {
    const { webpack } = compiler;
    const { Compilation, sources } = webpack;

    compiler.hooks.thisCompilation.tap(NS, (compilation) => {
      compilation.hooks.processAssets.tap(
        { name: NS, stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL },
        (assets) => {
          assets['../node/twig.mjs'] = new sources.RawSource(this.source);
        },
      );
    });
  }
}

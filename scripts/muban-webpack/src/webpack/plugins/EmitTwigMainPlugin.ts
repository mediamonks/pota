import type { Compiler, WebpackPluginInstance } from 'webpack';

const NS = 'EmitTwigMainPlugin';

type PluginOptions = {
  requiredPackages?: Array<string>;
};

export default class EmitTwigMainPlugin implements WebpackPluginInstance {
  public constructor(private options: PluginOptions = {}) {}
  get source() {
    // TODO: in future versions we could parse all files in the twig config folder and find imports to node modules,
    //  which we can then automatically include in this list
    const packagesToInstall = (this.options.requiredPackages ?? []).join(' ');

    return `
import { execSync } from "child_process";

${
  packagesToInstall.length > 0
    ? `execSync('npm init --yes && GIT_SSH_COMMAND="ssh" npm i --no-fund --no-audit ${packagesToInstall}', { stdio: [0, 1, 2] });`
    : ''
}

execSync('npx --yes @pota/twig-server -c -u -s ./twig-socket -e ./extensions/twig-extensions.cjs', { stdio: [0, 1, 2] });
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

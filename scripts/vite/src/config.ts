import { defineConfig, PluginOption, UserConfig } from 'vite';
import type { WatcherOptions } from 'rollup';
import type { BuildOptions, DevOptions, CommonOptions, PreviewOptions } from './types.js';

import { paths } from './paths.js';
import { injectEntryTagPlugin } from './plugins/inject-entry-tag-plugin.js';

export type ViteConfigOptions = CommonOptions &
  Partial<BuildOptions> &
  Partial<DevOptions> &
  Partial<PreviewOptions>;

export class ViteConfig<C extends ViteConfigOptions = ViteConfigOptions> {
  constructor(public readonly options: C) {}

  public get isDev() {
    return process.env.NODE_ENV === 'development';
  }

  public get isProd() {
    return process.env.NODE_ENV === 'production' || !this.isDev;
  }

  public get entry() {
    return paths.entry;
  }

  public async plugins(): Promise<Array<PluginOption>> {
    return [injectEntryTagPlugin(this.entry)];
  }

  public async final(): Promise<UserConfig> {
    return defineConfig({
      root: paths.user,
      plugins: await this.plugins(),
      mode: this.isDev ? 'development' : 'production',
      base: this.options['public-path'],
      logLevel: this.options['log-level'],
      server: {
        host: this.options['host'],
        open: this.options['open'],
        https: this.options['https'],
        port: this.options['port'],
        force: this.options['force'],
        cors: this.options['cors'],
      },
      build: {
        emptyOutDir: true,
        watch: (this.options['watch'] && ({} as WatcherOptions)) || null,
        sourcemap: this.options['source-map'],
        ...(this.options['output'] && { outDir: this.options['output'] }),
      },
    }) as UserConfig;
  }
}

export default (options: ViteConfigOptions) => new ViteConfig(options);

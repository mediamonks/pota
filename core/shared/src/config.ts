export interface PotaConfig {
  extends?: string;
  scripts?: ReadonlyArray<string>;
  omit?: ReadonlyArray<string>;
  rename?: Record<string, string>;
}

export interface PackageJsonShape {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  pota?: string;
  files?: ReadonlyArray<string>;
  publishConfig?: Record<string, unknown>;
  repository?: Record<string, string>;
  bugs?: Record<string, string>;
  author?: string;
  name?: string;
  version?: string;
}

export const PACKAGE_JSON_FILE = 'package.json' as const;

export const POTA_LOCAL_SKELETON = 'LOCAL';
export const POTA_DIR = 'pota';
export const POTA_CONFIG_FILE = 'config.js';
export const POTA_COMMANDS_DIR = 'commands';

export const EXCLUDED_FILES = ['yarn.lock', 'package-lock.json', 'node_modules'];

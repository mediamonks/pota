export interface ProjectPotaConfig {
  default?: string;
}

export interface SkeletonPotaConfig {
  extends?: string;
  excludedFiles?: ReadonlyArray<string>;
  "package.json"?: Omit<PackageJsonShape, "pota">
}

export type PotaConfig = ProjectPotaConfig | SkeletonPotaConfig;

export interface PackageJsonShape<C extends PotaConfig = PotaConfig> {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  pota?: C;
}

export const PACKAGE_JSON_FILE = "package.json" as const;

export const POTA_COMMANDS_DIR = "pota_commands" as const;

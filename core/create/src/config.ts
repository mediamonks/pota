type ObjectEntries = <T extends object>(
  o: T
) => Array<
  Extract<
    {
      [K in keyof T]: K extends string | number | symbol ? [K, T[K]] : never;
    }[keyof T],
    [string | number | symbol, unknown]
  >
>;

const SCOPE = "@pota";

const getPorterDependency = <T extends string>(name: T) => `${SCOPE}/${name}` as const;

const SKELETON_SHORTHANDS = {
  [getPorterDependency("webpack-skeleton")]: ["webpack"] as const,
};

const INVERTED_SKELETON_SHORTHANDS = Object.fromEntries(
  (Object.entries as ObjectEntries)(SKELETON_SHORTHANDS).flatMap(([skeleton, shorthands]) =>
    shorthands.map((shorthand) => [shorthand, skeleton] as const)
  )
);

export const isSkeletonShorthand = (shorthand: string) => shorthand in INVERTED_SKELETON_SHORTHANDS;

export const getSkeletonFromShorthand = (shorthand: string) => INVERTED_SKELETON_SHORTHANDS[shorthand];

export type PackageManager = 'yarn' | 'npm';

export const REPLACE_MARK = "<>";
export const UNDEFINED_MARK = "<undefined>";

export const POTA_PACKAGE_JSON_FILE = "pota.package.json";
export const POTA_CONFIG_FILE = "pota.js";
export const PACKAGE_JSON_FILE = "package.json";
export const DEFAULT_EXCLUDED_FILES = [
  POTA_PACKAGE_JSON_FILE,
  POTA_CONFIG_FILE,
  PACKAGE_JSON_FILE,
  "node_modules"
];


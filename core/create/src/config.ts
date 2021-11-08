type ObjectEntries = <T extends object>(
  o: T,
) => Array<
  Extract<
    {
      [K in keyof T]: K extends string | number | symbol ? [K, T[K]] : never;
    }[keyof T],
    [string | number | symbol, unknown]
  >
>;

const typedObjectEntries: ObjectEntries = Object.entries;

const SCOPE = '@pota';

const getPorterDependency = <T extends string>(name: T) => `${SCOPE}/${name}` as const;

const SKELETON_SHORTHANDS = {
  [getPorterDependency('webpack-skeleton')]: ['webpack'] as const,
  [getPorterDependency('react-skeleton')]: ['react'] as const,
  [getPorterDependency('react-base-skeleton')]: ['react-base'] as const,
  [getPorterDependency('vue-skeleton')]: ['vue'] as const,
};

const INVERTED_SKELETON_SHORTHANDS = Object.fromEntries(
  typedObjectEntries(SKELETON_SHORTHANDS).flatMap(([skeleton, shorthands]) =>
    shorthands.map((shorthand) => [shorthand, skeleton] as const),
  ),
);

export const isSkeletonShorthand = (shorthand: string) => shorthand in INVERTED_SKELETON_SHORTHANDS;

export const getSkeletonFromShorthand = (shorthand: string) =>
  INVERTED_SKELETON_SHORTHANDS[shorthand];

export type PackageManager = 'yarn' | 'npm';

export const POTA_CLI = '@pota/cli' as const;
export const POTA_CLI_BIN = 'pota' as const;

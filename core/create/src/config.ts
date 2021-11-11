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

const SKELETON_SHORTHANDS = {
  ['@pota/webpack-skeleton']: ['webpack'] as const,
  ['@pota/react-skeleton']: ['react'] as const,
  ['@pota/react-base-skeleton']: ['react-base'] as const,
  ['@pota/vue-skeleton']: ['vue'] as const,
};

const INVERTED_SKELETON_SHORTHANDS = Object.fromEntries(
  typedObjectEntries(SKELETON_SHORTHANDS).flatMap(([skeleton, shorthands]) =>
    shorthands.map((shorthand) => [shorthand, skeleton] as const),
  ),
);

export const isSkeletonShorthand = (shorthand: string) => shorthand in INVERTED_SKELETON_SHORTHANDS;

export const getSkeletonFromShorthand = (shorthand: string) =>
  INVERTED_SKELETON_SHORTHANDS[shorthand];

export const POTA_CLI = '@pota/cli' as const;
export const POTA_CLI_BIN = 'pota' as const;

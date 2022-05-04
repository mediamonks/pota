export type ObjectEntries = <T extends object>(
  o: T,
) => Array<
  Extract<
    {
      [K in keyof T]: K extends string | number | symbol ? [K, T[K]] : never;
    }[keyof T],
    [string | number | symbol, unknown]
  >
>;

export default Object.entries as ObjectEntries;

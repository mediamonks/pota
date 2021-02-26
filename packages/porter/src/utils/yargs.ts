type YargsModule = {
  handler?: (...args: unknown[]) => unknown;
};

export const prependHandler = (handler: NonNullable<YargsModule["handler"]>) => (
  module: YargsModule
) => ({
  ...module,
  handler: (...args: unknown[]) => {
    handler(...args);
    return module.handler?.(...args);
  },
});

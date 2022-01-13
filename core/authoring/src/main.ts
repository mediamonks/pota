import type { Skeleton, PackageJsonShape } from './types.js';

export { Skeleton, PackageJsonShape };

function extendSkeleton(
  base: Skeleton.Config,
  config: Skeleton.Config,
): typeof config & { extends: typeof base } {
  const mergedMeta: Skeleton.Meta<[]> = Object.fromEntries(
    Object.entries(base.meta ?? {}).map(([key, fn]) => [key, config.meta?.[key] ?? fn]),
  );

  const mergedCommands = Object.fromEntries(
    Object.entries(base.commands ?? {}).map(([command, properties]) => {
      let mergedOptions;

      const configProperties = config.commands?.[command] ?? {};

      if (properties.options) mergedOptions = [...properties.options];
      if (configProperties.options)
        mergedOptions = [...(mergedOptions ?? []), ...configProperties.options];

      return [
        command,
        {
          ...properties,
          ...configProperties,
          ...(mergedOptions && { options: mergedOptions }),
        },
      ];
    }),
  ) as Record<string, Skeleton.Command.Command<[]>>;

  return Object.assign(
    { ...config, commands: mergedCommands, meta: mergedMeta },
    { extends: base },
  );
}

export function define(
  base: Skeleton.Config,
  config: Skeleton.Config,
): typeof config & { extends: typeof base };
export function define(base: Skeleton.Config): typeof base;
export function define(base: Skeleton.Config, config?: Skeleton.Config): unknown {
  if (config) return extendSkeleton(base, config);

  return base;
}

define.option = function commandOption(
  option: string,
  description?: string,
  defaultValue?: unknown,
) {
  return { option, description, default: defaultValue };
};

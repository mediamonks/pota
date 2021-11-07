import { join, extname, basename } from 'path';
import { readdir } from 'fs/promises';

import { getNestedSkeletons } from '@pota/shared/skeleton';
import { getCWD } from '@pota/shared/fs';
import { POTA_LOCAL_SKELETON, POTA_COMMANDS_DIR, POTA_DIR } from '@pota/shared/config';

export interface CommandModule {
  command: string;
  skeleton: string;
  description?: string | ReadonlyArray<string>;
  options?: ReadonlyArray<{
    option: string;
    description: string;
    default?: string | number | boolean;
  }>;
  examples?: ReadonlyArray<string>;
  action: (...options: ReadonlyArray<unknown>) => void;
}

export async function getCommandModules(skeleton: string) {
  const dir = join(POTA_DIR, POTA_COMMANDS_DIR);

  const cwd = getCWD();

  // find all nested skeletons
  const skeletons = [
    { path: cwd, skeleton: POTA_LOCAL_SKELETON, files: await readdir(join(cwd, dir)) },
    ...Array.from(await getNestedSkeletons(cwd, skeleton, { dir })).reverse(),
  ];

  // parse command modules from nested skeletons
  const modules = await Promise.all(
    skeletons.flatMap(({ skeleton, path, files }) =>
      files.map(async (file) => {
        const modulePath = join(path, dir, file);
        const module: Partial<CommandModule> = await import(modulePath);

        return {
          ...module,
          skeleton,
          command: basename(modulePath, extname(modulePath)),
        };
      }),
    ),
  );

  // to skip duplicate commands
  const included = new Set<string>();

  // safety filter, to get rid of invalid modules
  return modules.filter((module) => {
    const condition =
      !included.has(module.command) && 'action' in module && typeof module.action === 'function';

    included.add(module.command);

    return condition;
  }) as ReadonlyArray<CommandModule>;
}

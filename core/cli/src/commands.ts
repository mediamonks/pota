import { join, extname, basename } from 'path';
import { readdir } from 'fs/promises';

import { getNestedSkeletons } from '@pota/shared/skeleton';
import { getCWD } from '@pota/shared/fs';
import { POTA_LOCAL_SKELETON, POTA_COMMANDS_DIR, POTA_DIR } from '@pota/shared/config';

interface Skeleton {
  skeleton: string;
  path: string;
  files: ReadonlyArray<string>;
}

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
  action?: (...options: ReadonlyArray<unknown>) => void;
}

export async function getCommandModules(skeleton: string) {
  const dir = join(POTA_DIR, POTA_COMMANDS_DIR);

  const cwd = getCWD();

  // find all nested skeletons
  const skeletons: Array<Skeleton> = Array.from(
    await getNestedSkeletons(cwd, skeleton, { dir }),
  ).reverse();

  try {
    const localSkeleton = {
      path: cwd,
      skeleton: POTA_LOCAL_SKELETON,
      files: await readdir(join(cwd, dir)),
    };

    skeletons.unshift(localSkeleton);
  } catch (error) { } //TODO: verbose logging

  // parse command modules from nested skeletons
  const files = skeletons.flatMap(({ skeleton, path, files }) =>
    files.map((file) => {
      const modulePath = join(path, dir, file);
      return {
        skeleton,
        modulePath,
        command: basename(modulePath, extname(modulePath)),
      };
    }),
  );

  // to skip duplicate commands
  const included = new Set<string>();

  return Promise.all(files
    // safety filter, remove duplicate modules
    .filter(({ command }) => {
      const condition = !included.has(command);

      included.add(command);

      return condition;
    })
    // import the modules
    .map(async ({ modulePath, ...rest }) => ({
      ...rest,
      ...((await import(modulePath)) as CommandModule),
    })));
}

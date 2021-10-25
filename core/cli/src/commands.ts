import { join, extname, basename } from "path";

import { getNestedSkeletons } from "@pota/shared/skeleton";
import { getCWD } from "@pota/shared/fs";

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

// TODO: make this configurable
const COMMAND_DIR = "pota_commands";

export async function getCommandModules(skeleton: string) {
  // find all nested skeletons
  const skeletons = (
    await getNestedSkeletons(getCWD(), skeleton, {
      enableExcludedFiles: false,
      readDir: COMMAND_DIR,
    })
  ).reverse();

  // parse command modules from nested skeletons
  const modules = await Promise.all(
    skeletons.flatMap(({ skeleton, path, files }) =>
      files.map(async (file) => {
        const modulePath = join(path, COMMAND_DIR, file);
        const module: Partial<CommandModule> = await import(modulePath);

        return {
          ...module,
          command: module.command || basename(modulePath, extname(modulePath)),
          skeleton,
        };
      })
    )
  );

  // to skip duplicate commands
  const included = new Set<string>();

  // safety filter, to get rid of invalid modules
  return modules.filter((module) => {
    const condition =
      !included.has(module.command) && "action" in module && typeof module.action === "function";

    included.add(module.command);

    return condition;
  }) as ReadonlyArray<CommandModule>;
}

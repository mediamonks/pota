import { join } from "path";
import { getNestedSkeletons } from "@pota/shared/skeleton";
import { getCWD } from "@pota/shared/fs";

export interface CommandModule {
  command?: string;
  description?: string | ReadonlyArray<string>;
  options?: ReadonlyArray<{ option: string, description: string, default?: string | number | boolean }>
  examples?: ReadonlyArray<string>
  action?: (...options: ReadonlyArray<unknown>) => void
}

interface CommandPath {
  skeleton: string;
  path: string;
}

// TODO: make this configurable
const COMMAND_DIR = "pota_commands";

export async function getCommandPaths(skeleton: string): Promise<ReadonlyArray<CommandPath>> {
  return (await getNestedSkeletons(getCWD(), skeleton, { enableExcludedFiles: false, readDir: COMMAND_DIR })).
    flatMap(({ skeleton, path, files }) => files.map(file => ({ skeleton, path: join(path, COMMAND_DIR, file) })));
}


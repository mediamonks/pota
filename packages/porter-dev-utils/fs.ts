import { realpathSync } from "fs-extra";
import { resolve, join } from "path";
import type { PorterDependency, PorterModule } from "./types";

/**
 * @returns absolute cwd (current working directory) path
 */
export const getCWD = () => realpathSync(process.cwd());

export const resolveUser: typeof resolve = (...pathSegments) => resolve(getCWD(), ...pathSegments);

export const importPorterModule = (
  projectPath: string,
  dependency: PorterDependency
): Promise<PorterModule> => import(join(projectPath, dependency, "porter.ts"));

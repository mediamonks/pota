import crossSpawn from "cross-spawn";
import { SkeletonTool, SkeletonType } from "./types";
import { execSync, SpawnOptions } from "child_process";

const PORTER_DEPENDENCY_REGEX = /porter-([a-zA-Z]+)-(skeleton|tools)/;

/**
 * will return `true` or `false` based if the passed dependency name
 * is a valid `porter` dependency
 * @param dependency - NPM dependency name
 * @example
 * 'porter-react-skeleton'
 * 'porter-react-tools'
 * 'porter-vue-skeleton'
 * 'porter-vue-tools'
 */
export const isPorterDependency = (dependency: string) =>
  Boolean(dependency.match(PORTER_DEPENDENCY_REGEX));

export function createPorterDependencyMatcher() {
  const expression = ``;
  return;
}

export const parsePorterDependencyType = (dependency: string) =>
  dependency.match(PORTER_DEPENDENCY_REGEX)?.[1] || undefined;

const createSpawn = (options: SpawnOptions) =>
  async function spawn(command: string, ...args: string[]): Promise<void> {
    await new Promise<void>((resolve, reject) =>
      crossSpawn(command, args, options)
        .on("close", (code) =>
          code !== 0 ? reject({ command: `${command} ${args.join(" ")}` }) : resolve()
        )
        .on("error", reject)
    );
  };

export const spawn = createSpawn({ stdio: "inherit" });
export const spawnSilent = createSpawn({ stdio: "ignore" });

export function command(command: string, quiet: boolean = true) {
  execSync(command, { stdio: quiet ? "ignore" : "inherit" });
}

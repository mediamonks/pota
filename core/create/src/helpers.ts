import npa from "npm-package-arg";
import readline from "readline";
import crossSpawn from "cross-spawn";
import { exec, SpawnOptions } from "child_process";
import { readPackageJson } from "@pota/shared/fs";
import { SPINNER } from "./spinner.js";
import kleur from "kleur";

const { green, cyan } = kleur;

export const newline = () => console.log();

export const log = (text: string) => console.log(text);

export function clear() {
  if (process.stdout.isTTY) {
    console.log("\n".repeat(process.stdout.rows));
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
  }
}

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

export const command = (command: string, quiet: boolean = true) =>
  new Promise<string | undefined>((resolve, reject) =>
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      resolve(quiet ? undefined : stdout || stderr);
    }));

export function isValidSkeleton(skeleton: string) {
  try {
    return Boolean(npa(skeleton));
  } catch (error) {
    return false;
  }
}

export function isFileSkeleton(skeleton: string) {
  return npa(skeleton).type === "file";
}

type PackageManager = "yarn" | "npm";

function getPackageManager(): PackageManager {
  const userAgent = process.env.npm_config_user_agent;

  if (userAgent?.startsWith("npm")) {
    return "npm";
  }

  if (userAgent?.startsWith("yarn")) {
    return "yarn";
  }

  return "npm";
}

interface InstallOptions {
  cwd?: string;
  dev?: boolean;
  npm?: boolean;
  yarn?: boolean;
}

export function createInstaller(options: InstallOptions = {}) {
  const { cwd, dev, yarn, npm } = options;
  let pre: Array<string> = [];
  let post: Array<string> = [];

  const pm = !yarn && !npm ? getPackageManager() : yarn ? "yarn" : "npm";

  switch (pm) {
    case "npm": {
      pre = ["install"]
      if (cwd) post.push("--prefix", cwd);
      if (dev) post.push("--save-dev");
      break;
    };
    case "yarn": {
      pre = ["add"]
      if (cwd) post.push("--cwd", cwd);
      if (dev) post.push("--dev");
      break;
    };
  }

  return async (...packages: ReadonlyArray<string>) => {
    // we must use `install` instead of `add` with `yarn`
    // when installing `package.json` deps
    switch (pm) {
      case "yarn":
        if (packages.length === 0) pre[0] = "install";
        break;
    }

    SPINNER.stopAndPersist();

    try {
      await spawn(pm, ...pre, ...packages, ...post);
    } finally {
      SPINNER.start();
    }

  };
}

export async function getSkeletonName(rawSkeletonName: string, packageJsonPath: string) {
  const parsedName = npa(rawSkeletonName);

  const { dependencies = {}, devDependencies = {} } = await readPackageJson(packageJsonPath);

  const dependency = [dependencies, devDependencies].flatMap(d => Object.entries(d)).find(([name, version]) => {
    switch (parsedName.type) {
      case "git": {
        const { gitCommittish, hosted } = parsedName;
        const { user, type, project } = hosted!;

        // github:mediamonks/pota#feature
        return version === `${type}:${user}/${project}#${gitCommittish}` || version === parsedName.rawSpec;
      }
      case "file": return version === parsedName.rawSpec;
      default: return name === rawSkeletonName;
    }
  })

  if (!dependency) throw new Error(`Could not find ${cyan(rawSkeletonName)} in ${green(packageJsonPath)}`);

  return dependency[0]; // the name of the dependency
}

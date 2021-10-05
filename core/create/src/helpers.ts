import npa from "npm-package-arg";
import readline from "readline";
import crossSpawn from "cross-spawn";
import { exec, SpawnOptions } from "child_process";
import { readPackageJson } from "./fs.js";

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
      if(error) {
        return reject(error);
      }
      resolve(quiet ? undefined : stdout || stderr);
    }));

export async function isValidSkeleton(skeleton: string) {
  try { 
    return Boolean(npa(skeleton));
  } catch (error) {
    return false;
  }
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

async function callManager(...commands: ReadonlyArray<string>) {
  switch (getPackageManager()) {
    case "npm":
      return command(["npm", ...commands].join(" "),false);
    case "yarn":
      return command(["yarn", ...commands].join(" "),false);
  }
}

interface InstallOptions  {
  cwd?: string;
  dev?: boolean;
}

export function createInstaller(options: InstallOptions = {}) {
  const { cwd, dev } = options;
  let pre: Array<string> = [];
  let post: Array<string> = [];

  const pm = getPackageManager();

  switch (pm) {
    case "npm": {
      pre.push("install");
      if (cwd) post.push("--prefix", cwd);
      if (dev) post.push("--save-dev");
      break;
    };
    case "yarn": {
      pre.push("add");
      if (cwd) post.push("--cwd", cwd);
      if (dev) post.push("--dev");
      break;
    };
  }

  return (...packages: ReadonlyArray<string>) => {
    // we must use `install` instead of `add` with `yarn`
    // when installing `package.json` deps
    switch (pm) {
      case "yarn": 
        if (packages.length === 0) pre[0] = "install";
        break;
    }

    return callManager(...pre, ...packages, ...post);
  };
}

export async function getSkeletonName(rawSkeletonName: string, packageJsonPath: string) {
  const { dependencies = {}, devDependencies = {} } = await readPackageJson(packageJsonPath);
  const [name] = [dependencies, devDependencies].flatMap(d => Object.entries(d)).find(
    ([name, version]) => name === rawSkeletonName || (version.startsWith("file:") ?  version.endsWith(rawSkeletonName) : version === rawSkeletonName)
  ) ?? [null];
 
  return name;
}

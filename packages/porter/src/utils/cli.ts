import readline from "readline";
import crossSpawn from "cross-spawn";
import { execSync, SpawnOptions } from "child_process";

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

export function command(command: string, quiet: boolean = true) {
  execSync(command, { stdio: quiet ? "ignore" : "inherit" });
}

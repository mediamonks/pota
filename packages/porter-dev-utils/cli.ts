import readline from "readline";

export function clear() {
  if (process.stdout.isTTY) {
    console.log("\n".repeat(process.stdout.rows));
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
  }
}

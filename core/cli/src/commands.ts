
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { join } from "path";

const {  readdir } = fs;

function getNodeModulesPath() {
  const currentPath = fileURLToPath(import.meta.url)

  const modulesDir = "node_modules";

  return currentPath.substring(0, currentPath.indexOf(modulesDir) + modulesDir.length);
}

export async function getCommandModules(skeleton: string): Promise<ReadonlyArray<string>> {
  // TODO: allow configuring "pota_commands"
  const commandsPath = join(getNodeModulesPath(), skeleton, "pota_commands");

  const files = await readdir(commandsPath, { withFileTypes: true })

  return files.filter(file => file.isFile()).map(file => join(commandsPath, file.name));
}


import { fileURLToPath } from "url";
import { resolve, dirname } from "path";
import { cwd } from "process";

export const self = dirname(fileURLToPath(import.meta.url));
export const user = cwd();

// Paths relative to the tool
export const skeletonNodeModules = resolve(self, "../node_modules");

// Paths relative to the user
export const source = resolve(user, "./src");
export const output = resolve(user, "./out");
export const publicDir = resolve(user, "./public");
export const userNodeModules = resolve(user, "node_modules");

// Paths relative to the source directory
export const entry = resolve(source, "./main.ts");

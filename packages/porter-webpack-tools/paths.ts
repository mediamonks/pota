import { resolve } from "path";
import { cwd } from "process";

export const self = __dirname;
export const user = cwd();

// Paths relative to the tool
export const config = resolve(self, "./webpack.config.ts");

// Paths relative to the user
export const source = resolve(user, "./src");
export const output = resolve(user, "./build");
export const publicDir = resolve(user, "./public");

// Paths relative to the source directory
export const entry = resolve(source, "./main.ts");

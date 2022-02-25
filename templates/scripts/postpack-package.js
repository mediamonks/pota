import process from 'process';
import { readFile, writeFile } from 'fs/promises';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';

const [, , argPath = '.'] = process.argv;
const packagePath = join(process.cwd(), argPath, 'package.json');

const selfPath = relative(process.cwd(), fileURLToPath(import.meta.url));
const prepackPath = selfPath.replace('postpack', 'prepack');

// read template package.json
let pkg = JSON.parse(await readFile(packagePath, { encoding: 'utf8' }));

// remove the "prepack" script (it calls this module)
pkg.scripts.prepack = `node ${prepackPath}`;
// remove the "postpack" script (it calls the ./prepack-package.js module)
pkg.scripts.postpack = `node ${selfPath}`;

// move dependencies from under "pota"
if (pkg.pota.dependencies) pkg.dependencies = pkg.pota.dependencies;
if (pkg.pota.devDependencies) pkg.devDependencies = pkg.pota.devDependencies;

delete pkg.pota;

const PKG_KEY_WEIGHTS = {
  engines: 1
}

pkg = Object.fromEntries(Object.entries(pkg).sort(([a], [b]) => (PKG_KEY_WEIGHTS[a] ?? -1)  - (PKG_KEY_WEIGHTS[b] ?? -1)))

await writeFile(packagePath, JSON.stringify(pkg, null, 2));

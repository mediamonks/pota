import process from 'process';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const [, , argPath = '.'] = process.argv;
const packagePath = join(process.cwd(), argPath, 'package.json');

// read template package.json
const pkg = JSON.parse(await readFile(packagePath, { encoding: 'utf8' }));

// remove the "prepack" script (it calls this module)
delete pkg.scripts.prepack;
// remove the "postpack" script (it calls the ./prepack-package.js module)
delete pkg.scripts.postpack;

// move dependencies under "pota"

pkg.pota = {
  dependencies: pkg.dependencies,
  devDependencies: pkg.devDependencies,
};

delete pkg.dependencies;
delete pkg.devDependencies;

await writeFile(packagePath, JSON.stringify(pkg, null, 2));

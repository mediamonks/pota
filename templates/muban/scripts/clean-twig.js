import shell from 'shelljs';
import { resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';

import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// this script removes all twig related files from the project
// run this if you're not using Twig in your muban project

// remove files
console.log('\nRemoving twig files from project...');
shell.rm('-rf', './config/twig');
shell.rm(
  '-f',
  './src/**/*.twig',
  './src/pages/_main.twig.ts',
  './plop-templates/component/*.twig.hbs',
);
console.log('Removal completed!');

// remove imports to twigEnvironment
import { run as jscodeshift } from 'jscodeshift/src/Runner.js';

const options = {
  dry: true,
  // print: true,
  // verbose: 1,
};

console.log('\nPatching "pota.config.js" ...');
await jscodeshift(
  resolve(__dirname, 'pota-twig-transform.cjs'),
  [resolve(__dirname, '../pota.config.js')],
  options,
);

console.log('\nPatching ".storybook/middleware.js" ...');
await jscodeshift(
  resolve(__dirname, 'middleware-transform.cjs'),
  [resolve(__dirname, '../.storybook/middleware.js')],
  options,
);

// disable twig in package.json
console.log('\nDisabling "twig-support" in "package.json" ...');
const packageJsonPath = resolve(__dirname, '../package.json');
const packageContent = JSON.parse(await readFile(packageJsonPath, 'utf-8'));

// disable twig
packageContent.config['twig-support'] = false;

// remove copy-twig command in scripts
const removeCopyTwigRegex = /&& pota copy-twig.*?(?=&|$)/g;
packageContent.scripts.build = packageContent.scripts.build.replace(removeCopyTwigRegex, '');
packageContent.scripts['storybook:build'] = packageContent.scripts['storybook:build'].replace(
  removeCopyTwigRegex,
  '',
);

await writeFile(packageJsonPath, JSON.stringify(packageContent, null, 2), 'utf-8');
console.log('Completed');

console.log('\nAll Done!');

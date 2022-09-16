import * as path from 'path';
import { readFile, writeFile } from 'fs/promises';

/**
 * This script executes post build and rewrites the index.html file removing
 * injected scripts from the build.
 */
(async () => {
  console.info('[PostBuild] Altering index.html to (re)move cra/vite injected scripts');

  const index = path.resolve('./dist/index.html');
  const contents = await readFile(index, { encoding: 'utf-8' });
  // Match webpack exports
  let parsed = contents.replace(/<script[\w\s="]* src="[\w\d-\/]*static\/.*\/?[\w\d\.-]*\.js"><\/script>/ig,'');
  // Match vite (rollup exports)
  parsed = contents.replace(
    /<script([\w\s="]*) src="([\w\d-\/]*assets\/.*\/?[\w\d\.-]*\.js)"><\/script>/ig,
    '<meta name="app-script" content="$2" />');

  await writeFile(index, parsed, { encoding: 'utf-8' });
})();
import * as path from 'path';
import { readFile, writeFile } from 'fs/promises';

/**
 * This script executes post build and rewrites the index.html file removing
 * injected scripts from the build.
 */
(async () => {
  console.info('[PostBuild] Cleaning up cra injected scripts');

  const index = path.resolve('./dist/index.html');
  const contents = await readFile(index, { encoding: 'utf-8' });
  const cleaned = contents.replace(/<script[\w\s="]* src="[\w\d-\/]*static\/.*\/[\w\d\.-]*\.js"><\/script>/ig,'');

  await writeFile(index, cleaned, { encoding: 'utf-8' });
})();
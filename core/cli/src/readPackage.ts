import { resolve } from 'path';
import { readFile } from 'fs/promises';

export async function readPackage(path: string) {
  return JSON.parse(await readFile(resolve(path, 'package.json'), { encoding: 'utf8' }));
}

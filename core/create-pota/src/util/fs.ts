import { join, dirname } from 'path';
import { readdir, access, copyFile, mkdir, rename, unlink as removeFile } from 'fs/promises';

import typedObjectEntries from './typedObjectEntries.js';

export class Recursive {
  static async readdir(dir: string, ignoredDirectories: ReadonlyArray<string>) {
    const files = await readdir(dir, { withFileTypes: true });
    const finalFiles: Array<string> = [];

    for (const file of files) {
      if (file.isFile()) finalFiles.push(file.name);
      else if (file.isDirectory() && !ignoredDirectories.includes(file.name)) {
        // sub files come in relative to `file.name`
        const subFiles = await Recursive.readdir(join(dir, file.name), ignoredDirectories);
        // we have to prepend the `file.name` so the path is always relative to `dir`
        finalFiles.push(...subFiles.map((filename) => join(file.name, filename)));
      }
    }

    return finalFiles;
  }
}

export async function copy(src: string, dst: string) {
  // create destination directories if they don't exist
  const dir = dirname(dst);

  try {
    await access(dir);
  } catch {
    await mkdir(dir, { recursive: true });
  }

  await copyFile(src, dst);
}

export async function removeFiles(projectPath: string, files: ReadonlyArray<string>) {
  for (const file of files) {
    try {
      await removeFile(join(projectPath, file));
    } catch { }
  }
}

export async function renameFiles(projectPath: string, renames: Record<string, string>) {
  for (const [file, newName] of typedObjectEntries(renames)) {
    try {
      await rename(join(projectPath, file), join(projectPath, newName));
    } catch { }
  }
}

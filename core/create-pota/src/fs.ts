import { join, dirname } from 'path';
import { readdir, access, copyFile, mkdir } from 'fs/promises';

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

import https from 'https';
import { join, resolve } from 'path';
import { rename, unlink as removeFile } from 'fs/promises';

import { copy, Recursive } from './fs.js';
import { getPackageInfo } from './package.js';

const IGNORED_FILES = ['LICENSE'];

const FILE_RENAMES = {
  gitignore: '.gitignore',
};

async function removeFiles(projectPath: string) {
  for (const file of IGNORED_FILES) {
    try {
      await removeFile(join(projectPath, file));
    } catch {}
  }
}

async function renameFiles(projectPath: string) {
  for (const [file, newName] of Object.entries(FILE_RENAMES) as ReadonlyArray<[string, string]>) {
    try {
      await rename(join(projectPath, file), join(projectPath, newName));
    } catch {}
  }
}

function getTar(url: string, out: string): Promise<void> {
  const tar = import('tar');
  return new Promise((resolve, reject) => {
    https.get(url, async (res) => {
      res.pipe((await tar).x({ strip: 1, C: out }).on('finish', resolve).on('error', reject));
    });
  });
}
export async function initNpmTemplate(pkg: string): Promise<void> {
  const projectPath = process.cwd();

  const pkgInfo = await getPackageInfo(pkg);

  if (!pkgInfo) throw new Error(`Error resolving ${pkg} tarball`);

  await getTar(pkgInfo.dist.tarball, projectPath);

  await Promise.all([renameFiles(projectPath), removeFiles(projectPath)]);
}

export async function initGitTemplate(repo: string): Promise<void> {
  const projectPath = process.cwd();

  // @see https://www.npmjs.com/package/@types/degit
  // @ts-ignore
  const tiged = await import('tiged').then((m) => m.default);

  await tiged(repo, { mode: 'git' }).clone(projectPath);

  await Promise.all([renameFiles(projectPath), removeFiles(projectPath)]);
}

export async function initFileTemplate(path: string) {
  const projectPath = process.cwd();

  for (let file of await Recursive.readdir(path, ['node_modules'])) {
    if (file in IGNORED_FILES) continue;
    const src = resolve(path, file);

    if (file in FILE_RENAMES) file = FILE_RENAMES[file as keyof typeof FILE_RENAMES];
    const dst = resolve(projectPath, file);

    await copy(src, dst);
  }
}

import https from 'https';
import { resolve } from 'path';

import { copy, Recursive, removeFiles, renameFiles } from './util/fs.js';
import { getPackageInfo, isFilePackage, isGitPackage } from './package.js';

const IGNORED_FILES = ['LICENSE'];

const FILE_RENAMES = {
  gitignore: '.gitignore',
  npmrc: '.npmrc',
};

function getTar(url: string, out: string): Promise<void> {
  const tar = import('tar');
  return new Promise((resolve, reject) => {
    https.get(url, async (res) => {
      res.pipe((await tar).x({ strip: 1, C: out }).on('finish', resolve).on('error', reject));
    });
  });
}

async function initNpmTemplate(pkg: string): Promise<void> {
  const projectPath = process.cwd();

  const tarball = (await getPackageInfo(pkg, 'dist.tarball')) as string;

  if (!tarball) throw new Error(`Error resolving ${pkg} tarball`);

  await getTar(tarball, projectPath);

  await Promise.all([renameFiles(projectPath, FILE_RENAMES), removeFiles(projectPath, IGNORED_FILES)]);
}

async function initGitTemplate(repo: string): Promise<void> {
  const projectPath = process.cwd();

  // @see https://www.npmjs.com/package/@types/degit
  // @ts-ignore
  const tiged = await import('tiged').then((m) => m.default);

  await tiged(repo, { mode: 'git' }).clone(projectPath);

  await Promise.all([renameFiles(projectPath, FILE_RENAMES), removeFiles(projectPath, IGNORED_FILES)]);
}

async function initFileTemplate(path: string) {
  const projectPath = process.cwd();

  for (let file of await Recursive.readdir(path, ['node_modules'])) {
    if (file in IGNORED_FILES) continue;
    const src = resolve(path, file);

    if (file in FILE_RENAMES) file = FILE_RENAMES[file as keyof typeof FILE_RENAMES];
    const dst = resolve(projectPath, file);

    await copy(src, dst);
  }
}

export async function downloadTemplate(template: string, cwd: string) {
  if (isGitPackage(template)) {
    await initGitTemplate(template);
    return;
  }

  if (isFilePackage(template)) {
    await initFileTemplate(resolve(cwd, template));
    return;
  }

  await initNpmTemplate(template);
}

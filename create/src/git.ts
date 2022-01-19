import { command } from './helpers.js';

export async function initializeGit(): Promise<boolean> {
  try {
    await command('git init -b main');
  } catch (error) {
    // if `-b main` isn't supported fallback to renaming the branch
    if ((error as { code: number }).code === 129) {
      await command('git init');
      await command('git branch master -m main');
    } else throw error;
  }

  await command('git add .');
  await command('git commit -m "Initial commit from @pota/create"');

  return true;
}

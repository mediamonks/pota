import prompts from 'prompts';

export async function promptGit() {
  const { git } = await prompts({
    type: 'toggle',
    name: 'git',
    message: 'Do you want to initialize git in the project directory?',
    initial: true,
    active: 'yes',
    inactive: 'no',
  });

  return git as boolean;
}

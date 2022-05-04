import { resolve } from 'path';
import { access } from 'fs/promises';

import isValidPackageName from 'validate-npm-package-name';
import prompts from 'prompts';

export function nameValidator(name: string) {
  const { errors, warnings, validForNewPackages, validForOldPackages } = isValidPackageName(name);

  const isNameOk = validForNewPackages && validForOldPackages;

  if (!isNameOk) return (errors?.join('\n') ?? warnings?.join('\n')) || false;

  return true;
}

export async function promptName(cwd: string) {
  const { name } = await prompts({
    type: 'text',
    name: 'name',
    message: 'Type in your project name:',
    initial: 'pota-project',
    async validate(name) {
      const nameOkorError = nameValidator(name);

      if (typeof nameOkorError === 'string') return nameOkorError;

      try {
        await access(resolve(cwd, name));
        return `The directory of the specified name already exists.`;
      } catch {
        return true;
      }
    },
  });

  return name;
}

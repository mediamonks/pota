import isValidPackageName from 'validate-npm-package-name';

export function nameValidator(name: string) {
  const { errors, warnings, validForNewPackages, validForOldPackages } = isValidPackageName(name);

  const isNameOk = validForNewPackages && validForOldPackages;

  if (!isNameOk) return (errors?.join('\n') ?? warnings?.join('\n')) || false;

  return true;
}

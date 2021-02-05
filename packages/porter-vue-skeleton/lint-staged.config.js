module.exports = {
  '**/*.{ts?(x),js?(x)}': () => ['yarn lint'],
  'package.json': (filenames) => ['sort-package-json', `git add ${filenames.join(' ')}`],
};

import { PorterSkeleton } from '@mediamonks/porter/lib/authoring/skeleton';

export default class PorterReactSkeleton extends PorterSkeleton<typeof import('./package.json')> {
  tool = '@mediamonks/porter-react-tools'; // TODO: should the tool be a dependency of the skeleton?

  dependencies = [
    'react',
    'react-dom',
    'web-vitals',
    'isntnt',
    'polished',
    'styled-components',
    'react-router',
    'react-router-dom',
    'react-is',
    'framer-motion',
    'mobx',
    'mobx-react-lite',
  ] as const;

  devDependencies = [];

  scripts = [
    'check-types',
    'fix',
    'fix:eslint',
    'fix:prettier',
    'fix:stylelint',
    'lint',
    'lint:eslint',
    'lint:stylelint',
    'upload-build',
    'deploy',
  ] as const;

  toolScripts = ['dev', 'build', 'serve'];

  excludedFiles = ['.eslintignore'];

  transformFiles = {
    gitignore: { name: '.gitignore' },
    'README.md': {
      source: (source) =>
        source.replace(
          '<PORTER:dependencies>',
          this.dependencies.map((dependency) => `- \`${dependency}\``).join('\n'),
        ),
    },
  };
}

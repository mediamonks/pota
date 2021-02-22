import { PorterSkeleton } from '@mediamonks/porter/lib/authoring/skeleton';

export default class PorterReactBaseSkeleton extends PorterSkeleton<
  typeof import('./package.json')
> {
  tool = '@mediamonks/porter-react-tool';

  dependencies = ['react', 'react-dom', 'web-vitals'] as const;

  devDependencies = [];

  scripts = ['check-types', 'fix', 'fix:eslint', 'fix:prettier', 'lint', 'lint:eslint'] as const;

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

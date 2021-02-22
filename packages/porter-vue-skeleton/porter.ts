import { PorterSkeleton } from '@mediamonks/porter/lib/authoring/skeleton';

export default class PorterVueSkeleton extends PorterSkeleton<typeof import('./package.json')> {
  tool = '@mediamonks/porter-vue-tool';

  dependencies = ['vue', 'vue-router', 'vuex', 'isntnt'] as const;

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

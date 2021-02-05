import jscodeshift from 'jscodeshift';
import {
  appendEslintRule,
  createDependencySynchronizer,
  createFileSynchronizer,
  createScriptSynchronizer,
} from '@mediamonks/porter-dev-utils/skeleton';

type LocalPackageJSON = typeof import('./package.json');
type Script = keyof LocalPackageJSON['scripts'];
type Dependency = keyof LocalPackageJSON['dependencies'];

const SKELETON_DEPENDENCIES: Dependency[] = ['vue', 'vue-router', 'vuex', 'isntnt'];

export const syncFiles = createFileSynchronizer('vue', [
  'build-tools',
  'generator-template',
  'src',
  'public',
  'src',
  '.editorconfig',
  [
    '.eslintrc.js',
    (source) =>
      appendEslintRule(
        jscodeshift(source),
        jscodeshift.property(
          'init',
          jscodeshift.stringLiteral('import/no-extraneous-dependencies'),
          jscodeshift.arrayExpression([
            jscodeshift.stringLiteral('error'),
            jscodeshift.objectExpression([
              jscodeshift.property(
                'init',
                jscodeshift.stringLiteral('packageDir'),
                jscodeshift.stringLiteral('node_modules/@mediamonks/porter-veu-skeleton'),
              ),
            ]),
          ]),
        ),
      ).toSource({ quote: 'single' }),
  ],
  '.huskyrc',
  '.nvmrc',
  '.prettierrc',
  '.senggenerator',
  'bitbucket-pipelines.yml',
  'lint-staged.config.js',
  'tsconfig.json',
  ['gitignore', undefined, (name) => `.${name}`],
  [
    'README.md',
    (source) =>
      source.replace(
        '<PORTER:dependencies>',
        SKELETON_DEPENDENCIES.map((dependency) => `- \`${dependency}\``).join('\n'),
      ),
  ],
]);

export const syncDependencies = createDependencySynchronizer('vue', SKELETON_DEPENDENCIES);

export const syncScripts = createScriptSynchronizer(
  'vue',
  [
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
  ] as Script[],
  ['dev', 'build'],
);

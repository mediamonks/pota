import type { Actions } from 'node-plop';
import type { NodePlopAPI } from 'plop';

const types = {
  atoms: 'atoms',
  molecules: 'molecules',
  organisms: 'organisms',
  blocks: 'blocks',
  none: '',
} as const;

type Keys = keyof typeof types;
type Type = typeof types[Keys];

const typePrefixMap: Record<Type, string> = {
  [types.atoms]: 'a',
  [types.molecules]: 'm',
  [types.organisms]: 'o',
  [types.blocks]: 'b',
  [types.none]: '',
};

export default function plopfile(plop: NodePlopAPI): void {
  plop.setGenerator('component', {
    description: 'Component generator',
    prompts: [
      {
        name: 'type',
        type: 'list',
        message: 'What type of component would you like to generate?',
        choices: [
          { name: 'Atom', value: 'atoms' },
          { name: 'Molecule', value: 'molecules' },
          { name: 'Organism', value: 'organisms' },
          { name: 'Block / CMS Component', value: 'blocks' },
          { name: 'No specific type', value: 'none' },
        ],
      },
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of your component?',
        validate: (value) => (value.length === 0 ? 'Please enter a component name' : true),
      },
      {
        name: 'id',
        type: 'input',
        message: 'What is the id of your component?',
        when: ({ type }) => type !== types.none,
        validate: (value) =>
          value.length === 0 || !/^\d+[\da-z]?$/u.test(value)
            ? 'This value needs follow the [number][variant] pattern (for example: 1 or 2a).'
            : true,
      },
      {
        name: 'typePrefix',
        type: 'input',
        message: 'What do you want to use as a prefix?',
        when: ({ type }) => type !== types.none,
        default: ({ type }: { type: Type }) => typePrefixMap[type],
      },
      {
        name: 'componentPrefix',
        type: 'list',
        message: 'What do you want to use as a component prefix?',
        when: ({ type }) => type !== types.none,
        choices: [
          { name: 'No prefix', value: '' },
          { name: 'Components Framework', value: 'cf' },
        ],
      },
    ],
    actions: (userData) => {
      const {
        componentPrefix = '',
        type,
        typePrefix = '',
        name,
        id = '',
      } = userData as Record<string, string>;
      const directory = type === types.none ? `` : `${type}/`;
      const data = {
        isUnknownComponent: type === types.none,
        isCmsComponent: type === types.blocks,
        componentName: `${componentPrefix}${componentPrefix && '-'}${typePrefix}${id}-${name}`,
      };

      const actions: Actions = [
        {
          data,
          type: 'addMany',
          base: 'plop-templates/component',
          templateFiles: 'plop-templates/component/*.*',
          destination: `src/components/${directory}/{{dashCase componentName}}/`,
        },
      ];

      if (data.isCmsComponent) {
        // twig template
        actions.push(
          {
            data,
            type: 'append',
            path: 'src/block-renderer/block-renderer.twig',
            pattern: / set includemap = \{/giu,
            template: `    '{{dashCase componentName}}': '../components/{{dashCase componentName}}/{{dashCase componentName}}.twig',`,
            abortOnFail: false,
          },

          // ts template
          {
            data,
            type: 'append',
            path: 'src/block-renderer/BlockRenderer.maps.ts',
            pattern: /\/\* plop_inject_template_import \*\//giu,
            template: `import { {{camelCase componentName}}Template } from '@/components/{{type}}/{{dashCase componentName}}/{{pascalCase componentName}}.template';`,
          },
          {
            data,
            type: 'append',
            path: 'src/block-renderer/BlockRenderer.maps.ts',
            pattern: /\/\* plop_inject_template \*\//giu,
            template: `  '{{dashCase componentName}}': {{camelCase componentName}}Template,`,
          },

          // component code
          {
            data,
            type: 'append',
            path: 'src/block-renderer/BlockRenderer.components.ts',
            pattern: /\/\* plop_inject_component \*\//giu,
            template: `    lazy('{{dashCase componentName}}', () => import('@/components/{{type}}/{{dashCase componentName}}/{{pascalCase componentName}}'),),`,
          },
        );
      }
      return actions;
    },
  });
}

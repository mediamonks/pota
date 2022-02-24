import type { NodePlopAPI } from 'plop';
import type { Actions } from 'node-plop';

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
          { name: 'Block', value: 'blocks' },
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
          value.length === 0 || !value.match(/^[0-9]+[a-z0-9]?$/)
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
      const directory = type !== types.none ? `${type}/` : ``;
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
        actions.push({
          data,
          type: 'append',
          path: 'src/block-renderer/BlockRenderer.maps.ts',
          pattern: /(\/\* PLOP_INJECT_TEMPLATE_IMPORT \*\/)/gi,
          template: `import { {{camelCase componentName}}Template } from '@/components/{{type}}/{{dashCase componentName}}/{{pascalCase componentName}}.template';`,
        });

        actions.push({
          data,
          type: 'append',
          path: 'src/block-renderer/BlockRenderer.maps.ts',
          pattern: /(\/\* PLOP_INJECT_TEMPLATE \*\/)/gi,
          template: `  '{{dashCase componentName}}': {{camelCase componentName}}Template,`,
        });

        actions.push({
          data,
          type: 'append',
          path: 'src/block-renderer/BlockRenderer.components.ts',
          pattern: /(\/\* PLOP_INJECT_COMPONENT \*\/)/gi,
          template: `    lazy('{{dashCase componentName}}', () => import( /* webpackExports: "lazy" */ '@/components/{{type}}/{{dashCase componentName}}/{{pascalCase componentName}}'),),`,
        });
      }

      return actions;
    },
  });
}

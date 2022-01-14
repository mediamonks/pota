import type { NodePlopAPI } from 'plop';
import type { Actions } from 'node-plop';

const types = {
  atoms: 'atoms',
  molecules: 'molecules',
  organisms: 'organisms',
  pages: 'pages',
  none: 'none',
  examples: 'examples',
} as const;

type Keys = keyof typeof types;
type Type = typeof types[Keys];

const typePrefixMap: Record<Type, string> = {
  [types.atoms]: 'a',
  [types.molecules]: 'm',
  [types.organisms]: 'o',
  [types.pages]: 'p',
  [types.examples]: '',
  [types.none]: '',
};

export default function plopfile(plop: NodePlopAPI) {
  plop.setGenerator('component', {
    description: 'Component generator',
    prompts: [
      {
        name: 'type',
        type: 'list',
        message: 'What type of component would you like to generate?',
        choices: [
          { name: 'Atom', value: types.atoms },
          { name: 'Molecule', value: types.molecules },
          { name: 'Organism', value: types.organisms },
          { name: 'Page', value: types.pages },
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
        when: ({ type }) => type !== types.none && type !== types.examples,
        validate: (value) =>
          value.length === 0 || !value.match(/^[0-9]+[a-z0-9]?$/)
            ? 'This value needs follow the [number][variant] pattern (for example: 1 or 2a).'
            : true,
      },
      {
        name: 'typePrefix',
        type: 'input',
        message: 'What do you want to use as a prefix?',
        when: ({ type }) => type !== types.none && type !== types.examples,
        default: ({ type }: { type: Type }) => typePrefixMap[type],
      },
    ],
    actions: (userData) => {
      const {
        componentPrefix = '',
        type,
        typePrefix = '',
        name,
        id = '',
      } = userData as Record<string, string> & { type: Type };
      const data = {
        componentName: `${componentPrefix}${componentPrefix && '-'}${typePrefix}${id}-${name}`,
      } as const;

      const actions: Actions = [
        {
          data,
          type: 'addMany',
          base: 'plop-templates/component',
          templateFiles: 'plop-templates/component/*.*',
          destination: `src/components/${getDirectory(type)}/{{dashCase componentName}}/`,
        },
      ];

      return actions;
    },
  });
}

function getDirectory(type: Type) {
  switch (type) {
    default:
      return type;
  }
}

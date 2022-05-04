import type { NodePlopAPI } from 'plop';
import type { ActionType } from 'node-plop';

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

export default function plopfile(plop: NodePlopAPI): void {
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
        message: ({ type }) =>
          `What is the name of your ${type === types.pages ? 'page' : 'component'}?`,
        validate: (value, { type } = {}) =>
          value.length === 0
            ? `Please enter a ${type === types.pages ? 'page' : 'component'} name`
            : true,
      },
      {
        name: 'id',
        type: 'input',
        message: 'What is the id of your component?',
        when: ({ type }) => type !== types.none && type !== types.examples && type !== types.pages,
        validate: (value) =>
          value.length === 0 || !value.match(/^[0-9]+[a-z0-9]?$/)
            ? 'This value needs follow the [number][variant] pattern (for example: 1 or 2a).'
            : true,
      },
      {
        name: 'typePrefix',
        type: 'input',
        message: 'What do you want to use as a prefix?',
        when: ({ type }) => type !== types.none && type !== types.examples && type !== types.pages,
        default: ({ type }: { type: Type }) => typePrefixMap[type],
      },
      {
        type: 'input',
        name: 'pathname',
        message: 'What is the pathname to the page (i.e path/to/page/ or leave blank)?',
        when: ({ type }) => type === types.pages,
        validate: (value) =>
          value !== '' && !value.match(/^([a-z]+(-[a-z]+)*\/)+$/)
            ? 'The pathname needs to be lowercase and only use the symbols / and -.'
            : true,
      },
    ],
    actions(answers = { type: 'none' }) {
      const { type } = answers as { type: Type };

      return getActions(type, answers);
    },
  });
}

function getActions(
  type: Type,
  { componentPrefix = '', typePrefix = '', name, id = '', pathname = '' }: Record<string, string>,
): Array<ActionType> {
  switch (type) {
    case types.pages:
      return [
        {
          data: {
            name,
            pagePath: '../'.repeat((pathname.match(/\//g) || '').length + 1),
          },
          type: 'add',
          templateFile: 'plop-templates/page.hbs',
          path: `./src/pages/{{pathname}}{{dashCase name}}.tsx`,
        },
      ];
    default:
      return [
        {
          data: {
            type,
            componentName: `${componentPrefix}${componentPrefix && '-'}${typePrefix}${id}-${name}`,
          },
          type: 'addMany',
          base: 'plop-templates/component',
          templateFiles: 'plop-templates/component/*.*',
          destination: `src/components/${getDirectory(type)}/{{dashCase componentName}}/`,
        },
      ];
  }
}

function getDirectory(type: Type) {
  switch (type) {
    default:
      return type;
  }
}

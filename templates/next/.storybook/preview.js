import { themeDecorator } from '../storybook-helpers/decorators';

export const decorators = [themeDecorator];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'light',
        value: '#F8F6F2',
      },
      {
        name: 'dark',
        value: '#092626',
      },
    ],
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

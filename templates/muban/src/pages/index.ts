import type { AppTemplateProps } from '../App.template';

export const data = (): AppTemplateProps => ({
  layout: {
    name: 'default-layout',
    props: {
      blocks: [
        {
          name: 'toggle-expand',
          props: {
            isExpanded: false,
          },
        },
      ],
    },
  },
});

// https://github.com/nfl/react-helmet
export const meta = (): Record<string, string> => ({
  title: 'foo',
  description: 'bar',
});

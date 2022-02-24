import type { AppTemplateProps } from '../App.template';

export const data = (): AppTemplateProps => ({
  layout: {
    name: 'custom-layout',
    props: {
      message: "I'm fine",
    },
  },
});

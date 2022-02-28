import type { Story } from '@muban/storybook';
import { buttonTemplate } from './Button.template';
import type { ButtonTemplateProps } from './Button.template';

export default {
  title: 'Button',
  argTypes: {
    label: { control: 'text' },
  },
  parameters: {
    actions: {
      handles: ['click', '[data-component="button"]'],
    },
  },
};

export const Default: Story<ButtonTemplateProps> = {
  render: () => ({
    template: buttonTemplate,
  }),
  args: {
    label: 'Click me',
  },
};

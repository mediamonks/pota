import type { Story } from '@muban/storybook';
import { ToggleExpand } from './ToggleExpand';
import type { ToggleExpandProps } from './ToggleExpand.template';
import { toggleExpandTemplate } from './ToggleExpand.template';

export default {
  title: 'ToggleExpand',
  argTypes: {
    isExpanded: { control: 'boolean' },
  },
};

export const Default: Story<ToggleExpandProps> = {
  render: () => ({
    component: ToggleExpand,
    template: toggleExpandTemplate,
  }),
  args: {
    isExpanded: false,
  },
};

export const Expanded: Story<ToggleExpandProps> = {
  ...Default,
  args: {
    isExpanded: true,
  },
};

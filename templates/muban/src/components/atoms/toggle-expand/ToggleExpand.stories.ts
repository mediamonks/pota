import type { Story } from '@muban/storybook/types-6-0';
import { ToggleExpand } from './ToggleExpand';
import type { ToggleExpandProps } from './ToggleExpand.template';
import { toggleExpandTemplate } from './ToggleExpand.template';

export default {
  title: 'ToggleExpand',
  argTypes: {
    isExpanded: { control: 'boolean' },
  },
};

export const Default: Story<ToggleExpandProps> = () => ({
  component: ToggleExpand,
  template: toggleExpandTemplate,
});
Default.args = {
  isExpanded: false,
};

export const Expanded = Default.bind({});
Expanded.args = {
  isExpanded: true,
};

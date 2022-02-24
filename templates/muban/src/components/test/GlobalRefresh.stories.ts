import { createDecoratorComponent } from '@muban/storybook';
import { html } from '@muban/template';
import type { Story } from '@muban/storybook/types-6-0';
import { GlobalRefresh, globalRefreshTemplate, Tooltip } from './GlobalRefresh';

export default {
  title: 'use-cases/global-refresh',
};

export const GlobalRefreshStory: Story = () => ({
  appComponents: [Tooltip],
  component: GlobalRefresh,
  template: globalRefreshTemplate,
});

export const GlobalRefreshDecorator = GlobalRefreshStory.bind({});
GlobalRefreshDecorator.decorators = [
  createDecoratorComponent(({ template }) => ({
    template: () => html`<div data-foo="bar">${template}</div>`,
  })),
];

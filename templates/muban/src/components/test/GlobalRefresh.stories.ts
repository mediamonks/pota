import { createDecoratorComponent } from '@muban/storybook';
import { html } from '@muban/template';
import type { Story } from '@muban/storybook';
import { GlobalRefresh, globalRefreshTemplate, Tooltip } from './GlobalRefresh';

export default {
  title: 'use-cases/global-refresh',
};

export const GlobalRefreshStory: Story = {
  render: () => ({
    appComponents: [Tooltip],
    component: GlobalRefresh,
    template: globalRefreshTemplate,
  }),
};

export const GlobalRefreshDecorator: Story = {
  ...GlobalRefresh,
  decorators: [
    createDecoratorComponent(({ template }) => ({
      template: () => html`<div data-foo="bar">${template}</div>`,
    })),
  ],
};

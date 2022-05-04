import type { Meta } from '@storybook/react';

import { themeDecorator } from '../../../storybook-helpers/decorators';
import { createTextTemplate } from '../../../storybook-helpers/stories';

import { Heading } from './Heading';

export default {
  title: 'Atoms/Heading',
  component: Heading,
  decorators: [themeDecorator],
  argTypes: {
    type: {
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      control: {
        type: 'select',
      },
    },
    text: { control: 'text' },
    as: { control: 'text' },
    forwardedAs: { control: 'text' },
  },
} as Meta;

const textTemplate = createTextTemplate(Heading);

export const Default = textTemplate.bind({});
export const H2 = textTemplate.bind({});
export const H3 = textTemplate.bind({});
export const H4 = textTemplate.bind({});
export const H5 = textTemplate.bind({});
export const H6 = textTemplate.bind({});

Default.args = {
  type: 'h1',
  text: 'Lorem ipsum dolor sit amet, adipiscing  ornare cursus',
};

H2.args = {
  ...Default.args,
  type: 'h2',
};

H3.args = {
  ...Default.args,
  type: 'h3',
};

H4.args = {
  ...Default.args,
  type: 'h4',
};

H5.args = {
  ...Default.args,
  type: 'h5',
};

H6.args = {
  ...Default.args,
  type: 'h6',
};

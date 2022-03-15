import type { Meta } from '@storybook/react';

import { createTextTemplate } from '../../../storybook-helpers/stories';
import Paragraph, { ParagraphProps } from './Paragraph';

export default {
  title: 'Paragraph',
  component: Paragraph,
  argTypes: {
    size: {
      control: { type: 'select', options: ['medium', 'small'] as Array<ParagraphProps['size']> },
    },
    weight: {
      control: { type: 'select', options: ['regular', 'bold'] as Array<ParagraphProps['weight']> },
    },
    text: { control: 'text' },
  },
} as Meta;

const Template = createTextTemplate(Paragraph);

export const Default = Template.bind({});
Default.args = { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' };

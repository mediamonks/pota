import type { Story } from '@muban/storybook';
import { ImageTest } from './ImageTest';
import { imageTestDefaultMockData } from './ImageTest.mocks';
import type { ImageTestProps } from './ImageTest.template';
import { imageTestTemplate } from './ImageTest.template';

export default {
  title: 'ImageTest',
  argTypes: {
    dataImage: { control: 'text' },
  },
};

export const Default: Story<ImageTestProps> = {
  render: () => ({
    component: ImageTest,
    template: imageTestTemplate,
  }),
  args: {
    dataImage: `${process.env.PUBLIC_PATH}static/img/mock-test.jpg`,
  },
};

export const Mock: Story<ImageTestProps> = {
  ...Default,
  args: imageTestDefaultMockData,
};

import type { Story } from '@muban/storybook';
import { VideoTest } from './VideoTest';
import { videoTestDefaultMockData } from './VideoTest.mocks';
import type { VideoTestProps } from './VideoTest.template';
import { videoTestTemplate } from './VideoTest.template';

export default {
  title: 'VideoTest',
  argTypes: {
    dataVideo: { control: 'text' },
  },
};

export const Default: Story<VideoTestProps> = {
  render: () => ({
    component: VideoTest,
    template: videoTestTemplate,
  }),
  args: {
    dataVideo: `${process.env.PUBLIC_PATH}static/media/dummy-video-1.mp4`,
  },
};

export const Mock: Story<VideoTestProps> = {
  ...Default,
  args: videoTestDefaultMockData,
};

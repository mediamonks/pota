import type { ComponentTemplateResult } from '@muban/template';
import { html } from '@muban/template';

export type VideoTestProps = {
  dataVideo?: string;
};

export function videoTestTemplate({ dataVideo }: VideoTestProps): ComponentTemplateResult {
  return html`<div data-component="video-test">
    <h1>Video Test</h1>
    <div>
      <h2>Data Video</h2>
      <video controls>
        <source type="video/mp4" src=${dataVideo} />
      </video>
    </div>
    <div>
      <h2>JS Video</h2>
      <video controls>
        <source type="video/mp4" data-ref="js-video" src="" />
      </video>
    </div>
    <div>
      <h2>Template Video</h2>
      <video controls>
        <source type="video/mp4" src="${process.env.PUBLIC_PATH}static/media/dummy-video-1.mp4" />
      </video>
    </div>
  </div>`;
}

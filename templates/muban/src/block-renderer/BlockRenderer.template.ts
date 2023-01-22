import type { TemplateMap } from '@muban/template';
import { html } from '@muban/template';
import { toggleExpandTemplate } from '../components/atoms/toggle-expand/ToggleExpand.template';
import { imageTestTemplate } from '../components/image-test/ImageTest.template';
import { videoTestTemplate } from '../components/video-test/VideoTest.template';
import { renderLazyComponentTemplate } from '../utils/createComponentRenderer';

const componentMap = {
  /* eslint-disable @typescript-eslint/naming-convention */
  'toggle-expand': toggleExpandTemplate,
  'image-test': imageTestTemplate,
  'video-test': videoTestTemplate,
  /* eslint-enable @typescript-eslint/naming-convention */
};

export type BlockRendererTemplateProps = {
  blocks: Array<TemplateMap<typeof componentMap>>;
};

export function blockRendererTemplate({ blocks }: BlockRendererTemplateProps): string {
  return html`
    <div data-component="block-renderer">
      ${renderLazyComponentTemplate(componentMap, { components: blocks })}
    </div>
  `;
}

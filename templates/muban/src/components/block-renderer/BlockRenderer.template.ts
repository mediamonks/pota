import type { TemplateMap } from '@muban/template';
import { html } from '@muban/template';
import { renderLazyComponentTemplate } from '../../utils/createComponentRenderer';
import { toggleExpandTemplate } from '../atoms/toggle-expand/ToggleExpand.template';
import { imageTestTemplate } from '../image-test/ImageTest.template';
import { videoTestTemplate } from '../video-test/VideoTest.template';

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

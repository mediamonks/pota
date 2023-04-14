import type { TemplateMap } from '@muban/template';
import { html } from '@muban/template';
import { renderLazyComponentTemplate } from '../../../utils/createComponentRenderer';
import { customLayoutTemplate } from '../custom/CustomLayout.template';
import { defaultLayoutTemplate } from '../default/DefaultLayout.template';

const componentMap = {
  /* eslint-disable @typescript-eslint/naming-convention */
  'default-layout': defaultLayoutTemplate,
  'custom-layout': customLayoutTemplate,
  /* eslint-enable @typescript-eslint/naming-convention */
};

export type AppTemplateProps = {
  layout: TemplateMap<typeof componentMap>;
};

export function appTemplate({ layout }: AppTemplateProps): string {
  return html`
    <div data-component="app">
      ${renderLazyComponentTemplate(componentMap, { component: layout })}
    </div>
  `;
}

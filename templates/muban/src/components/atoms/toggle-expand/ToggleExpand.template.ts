import type { ComponentTemplateResult } from '@muban/template';
import { html, jsonScriptTemplate } from '@muban/template';
import { buttonTemplate } from '../button/Button.template';
import { cfA2Icon } from '../cf-a2-icon/CfA2Icon.template';

const getButtonLabel = (isExpanded: boolean) => (isExpanded ? 'read less...' : 'read more...');

export type ToggleExpandProps = {
  isExpanded?: boolean;
};

export function toggleExpandTemplate(
  { isExpanded = false }: ToggleExpandProps,
  ref?: string,
): ComponentTemplateResult {
  return html`<div data-component="toggle-expand" data-ref=${ref}>
    ${jsonScriptTemplate({ isExpanded })}
    <p>${cfA2Icon({ name: 'checkmark' })}</p>
    <p>
      B Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque consequatur cum laboriosam
      voluptate voluptatibus. Alias aut autem eligendi perspiciatis provident quae quisquam sapiente
      sequi, vero voluptatibus. Dolores dolorum exercitationem voluptate.
    </p>
    <p>${buttonTemplate({ label: getButtonLabel(isExpanded) }, 'expand-button')}</p>
    <p data-ref="expand-content">
      Lorem ipsum <strong>dolor</strong> sit <em>amet</em>, consectetur adipisicing elit. Distinctio
      error incidunt necessitatibus repellendus sint. A, deleniti ducimus ex facere ipsam libero
      quae quas temporibus voluptas voluptates. Blanditiis consequatur deserunt facere!
    </p>
  </div>`;
}

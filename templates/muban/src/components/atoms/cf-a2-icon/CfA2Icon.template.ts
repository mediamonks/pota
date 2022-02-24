import type { ComponentTemplateResult } from '@muban/template';
import { html } from '@muban/template';
import classNames from 'clsx';

import type { CfA2IconTemplateProps } from './CfA2Icon.types';

export const cfA2Icon = (
  { name, className }: CfA2IconTemplateProps,
  ref?: string,
): ComponentTemplateResult => html`<span
  data-component="cf-a2-icon"
  data-name=${name}
  data-ref=${ref}
  ...${{ class: className ? classNames(className) : null }}
/>`;

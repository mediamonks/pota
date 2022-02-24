import { html } from '@muban/template';

export type ButtonTemplateProps = {
  label: string;
};

export const buttonTemplate = ({ label }: ButtonTemplateProps, ref?: string): string => html`<button
  data-component="button"
  data-ref=${ref}
  class="btn btn-primary"
>
  ${label}
</button>`;

export const meta = {
  template: buttonTemplate,
};

import { html } from '@muban/template';

export type CustomLayoutTemplateProps = { message: string };

export function customLayoutTemplate({ message }: CustomLayoutTemplateProps): string {
  return html`<div data-component="custom-layout">Custom layout - ${message}.</div>`;
}

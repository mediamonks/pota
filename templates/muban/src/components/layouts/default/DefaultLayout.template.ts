import { html } from '@muban/template';
import type { BlockRendererTemplateProps } from '../../block-renderer/BlockRenderer.template';
import { blockRendererTemplate } from '../../block-renderer/BlockRenderer.template';

export type DefaultLayoutTemplateProps = BlockRendererTemplateProps;

export function defaultLayoutTemplate({ blocks }: DefaultLayoutTemplateProps): string {
  return html`<div data-component="default-layout">${blockRendererTemplate({ blocks })}</div>`;
}

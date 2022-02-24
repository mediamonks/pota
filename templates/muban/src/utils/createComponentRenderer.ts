import type { ComponentTemplate } from '@muban/template';
import { html } from '@muban/template';

export type ComponentRendererTemplateProps = {
  component?: { name: string; props: Record<string, unknown> };
  components?: Array<{ name: string; props: Record<string, unknown> }>;
};

export function renderLazyComponentTemplate(
  componentMap: Record<string, ComponentTemplate>,
  { component, components }: ComponentRendererTemplateProps,
): string | Array<string> {
  const renderList = (components || []).concat(component || []);
  return html`${renderList.map((c) => componentMap[c.name]?.(c.props) || '')}`;
}

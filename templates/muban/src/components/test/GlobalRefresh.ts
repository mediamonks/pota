import { bind, computed, defineComponent, propType, ref, refComponent } from '@muban/muban';
import { html } from '@muban/template';

export const Tooltip = defineComponent({
  name: 'tooltip',
  props: {
    content: propType.string.defaultValue('').source({ type: 'text', target: 'self' }),
  },
  setup({ props }) {
    // eslint-disable-next-line no-console
    console.log('Tooltip init', props.content);
    return [];
  },
});
const Child = defineComponent({
  name: 'child',
  refs: {
    content: 'content',
  },
  props: {
    content: propType.string.source({ type: 'html', target: 'content' }),
  },
  setup({ refs, props }) {
    return [bind(refs.content, { html: computed(() => props.content) })];
  },
});

export const GlobalRefresh = defineComponent({
  name: 'global-refresh',
  refs: {
    child: refComponent(Child),
  },
  setup({ refs }) {
    const updatedContent = ref(
      refs.child.component?.props.content?.replace(
        /##([a-z\d]+)##/gi,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        (_, content) => `<span data-component="tooltip"><strong>${content}</strong></span>`,
      ) ?? '',
    );

    return [bind(refs.child, { content: updatedContent })];
  },
});

export function globalRefreshTemplate(): string {
  return html` <div data-component="global-refresh">
    <div data-component="child">
      <h1>Test</h1>
      <div data-ref="content">Foo ##tooltip1## bar ##tooltip2##.</div>
    </div>
  </div>`;
}

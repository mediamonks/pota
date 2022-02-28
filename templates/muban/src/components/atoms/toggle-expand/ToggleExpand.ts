import type { Ref } from '@muban/muban';
import { defineComponent, ref, propType, computed, bind } from '@muban/muban';
import { isBoolean, optional } from 'isntnt';

import './toggle-expand.scss';
import { CfA2Icon } from '../cf-a2-icon/CfA2Icon';

import data from '../../../assets/json/test.json';

// eslint-disable-next-line no-console
console.log('json data test', data);

export const useToggle = (
  initialValue: boolean
): readonly [Ref<boolean>, (force?: boolean) => void] => {
  const state = ref(initialValue);
  const toggle = (force?: boolean): void => {
    state.value = force === undefined ? !state.value : force;
  };
  return [state, toggle] as const;
};

const getButtonLabel = (isExpanded: boolean) => (isExpanded ? 'read less...' : 'read more...');

export const ToggleExpand = defineComponent({
  name: 'toggle-expand',
  components: [CfA2Icon],
  props: {
    isExpanded: propType.boolean.validate(optional(isBoolean)),
  },
  refs: {
    expandButton: 'expand-button',
    expandContent: 'expand-content',
  },
  setup({ props, refs }) {
    const [isExpanded, toggleExpanded] = useToggle(props.isExpanded ?? false);
    const expandButtonLabel = computed(() => getButtonLabel(isExpanded.value));

    return [
      bind(refs.expandButton, { text: expandButtonLabel, click: () => toggleExpanded() }),
      bind(refs.self, {
        css: { isExpanded },
      }),
    ];
  },
});

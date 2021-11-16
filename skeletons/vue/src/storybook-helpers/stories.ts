import type { Meta, Story } from "@storybook/vue3";
import type { ConcreteComponent } from "vue";

export function createTemplate<P extends {}>(components: Record<string, ConcreteComponent<P>>): Story<P> {
  return (args) => ({
    components,
    setup() {
      return { args };
    },
    template: "<HomePage />",
  });
}


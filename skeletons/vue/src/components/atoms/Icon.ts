import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    // eslint-disable-next-line vue/require-default-prop
    name: String,
  },
  async setup(props) {
    const logo = (await import(`../../assets/icons/${props.name}.svg?raw`)).default;

    return { logo };
  },
});

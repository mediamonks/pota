
import type { Meta } from "@storybook/vue3";

import HomePage from "./HomePage.vue";
import { createTemplate } from "../../../storybook-helpers/stories"

export default {
  component: HomePage,
  title: "HomePage",
} as Meta;

const Template = createTemplate({ HomePage });

export const Default = Template.bind({});
Default.args = {};

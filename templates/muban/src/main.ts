import { createApp } from '@muban/muban';
import { CfA2Icon } from './components/atoms/cf-a2-icon/CfA2Icon';
import { App } from './components/layouts/app/App';

import './styles/main.scss';

const app = createApp(App);
// eslint-disable-next-line unicorn/prefer-query-selector
const element = document.getElementById('app');
if (element) {
  app.component(CfA2Icon);
  app.mount(element);
}

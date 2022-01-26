import { createApp } from 'vue';

import './styles/screen.scss';

import App from './components/unlisted/App.vue';
import reportWebVitals from './reportWebVitals';
import plugins from './config/plugins';
import directives from './config/directives';
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"

// create app instace
const instance = createApp(App);

// apply plugins to instance
for (const plugin of plugins) {
  instance.use(plugin);
}

// apply directives to instance
for (const [name, directive] of Object.entries(directives)) {
  instance.directive(name, directive);
}

// mount the instance to the DOM
instance.mount('#root');

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

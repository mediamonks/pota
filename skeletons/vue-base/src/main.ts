import { createApp } from 'vue';

import App from './App.vue';
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"

createApp(App).mount("#root");

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

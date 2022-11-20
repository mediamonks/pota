import * as serviceWorkerRegistration from './serviceWorkerRegistration';


// eslint-disable-next-line unicorn/prefer-query-selector, @typescript-eslint/no-non-null-assertion
const rootNode = document.getElementById('root')!;
const app = document.createElement('p');
app.textContent = 'Edit src/main.ts and save to reload.';

rootNode.appendChild(app);

// declaring an empty export to satisfy TypeScript's enabled `isolatedModules` flag
export {};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

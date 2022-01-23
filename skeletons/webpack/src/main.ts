import * as serviceWorkerRegistration from "./serviceWorkerRegistration"

document.body.innerHTML = `
  <div>
    <p>
    Edit <code>src/main.ts</code> and save to reload.
    </p>
  </div>
`;

// declaring an empty export to satisfy TypeScript's enabled `isolatedModules` flag
export {};


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

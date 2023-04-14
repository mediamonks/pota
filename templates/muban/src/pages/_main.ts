/* eslint-disable unicorn/prefer-module,require-unicode-regexp, prefer-named-capture-group */
export { appTemplate } from '../components/layouts/app/App.template';

// page data
// eslint-disable-next-line unicorn/no-unsafe-regex
const context = require.context('.', true, /^(?:(?!_).*\/)?(?!_)[^/]+\.ts$/u);

export const pages = Object.fromEntries(
  context
    .keys()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((filename) => [/\/(.*)\.ts/giu.exec(filename)![1] as string, context(filename)]),
);

/* eslint-disable unicorn/prefer-module,require-unicode-regexp, prefer-named-capture-group */
export { default as appTemplate } from '../components/layouts/app/app.html.twig';

// twig templates
const twigContext = require.context('../components', true, /(.*)\.html.twig$/);

for (const filename of twigContext.keys()) {
  twigContext(filename);
}

// page data
// eslint-disable-next-line unicorn/no-unsafe-regex
const context = require.context('.', true, /^(?:(?!_).*\/)?(?!_)[^/]+\.ts$/u);

export const pages = Object.fromEntries(
  context
    .keys()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((filename) => [/\/(.*)\.ts/gi.exec(filename)![1] as string, context(filename)]),
);

export { default as appTemplate } from '../app.twig';

// twig templates
const twigContext = require.context('..', true, /(.*)\.twig$/);

twigContext
  .keys()
  .forEach((filename) => twigContext(filename))

// page data
const context = require.context('.', true, /^(?:(?!_).*[/])?(?!_)[^/]+\.ts$/);

export const pages = Object.fromEntries(
  context
    .keys()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((filename) => [/\/(.*)\.ts/gi.exec(filename)![1] as string, context(filename)]),
);

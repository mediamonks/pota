export { appTemplate } from '../App.template';

const context = require.context('.', true, /^(?:(?!_).*[/])?(?!_)[^/]+\.ts$/);

export const pages = Object.fromEntries(
  context
    .keys()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((filename) => [/\/(.*)\.ts/gi.exec(filename)![1] as string, context(filename)]),
);

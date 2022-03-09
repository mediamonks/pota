// Full Astro Configuration API Documentation:
// https://docs.astro.build/reference/configuration-reference

// @ts-check
export default /** @type {import('astro').AstroUserConfig} */ ({
  buildOptions: {
    site: 'https://mediamonks.github.io/pota/',
  },
  renderers: [
    // Enable the Preact renderer to support Preact JSX components.
    '@astrojs/renderer-preact',
    // Enable the React renderer, for the Algolia search component
    '@astrojs/renderer-react',
  ],
});

const DEFAULT_SERVER_RENDERING = process.env.TWIG_SUPPORT;

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  server: {
    url: `http://localhost:6006/component-templates`,
    // fetchStoryHtml,
  },
};

// add global var to control server rendering
export const globalTypes = {
  renderMode: {
    name: 'Render Mode',
    description: 'Render template on the server or client',
    defaultValue: DEFAULT_SERVER_RENDERING ? 'server' : 'client',
    toolbar: {
      icon: 'transfer',
      items: ['client', 'server'],
      dynamicTitle: true,
    },
  },
};

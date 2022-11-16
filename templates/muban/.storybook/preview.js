import '../src/styles/main.scss';

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
    // customFetchStoryHtml,
  },
};

// add global var to control server rendering
export const globalTypes = {
  serverRendering: {
    name: 'Server',
    description: 'Server Rendering',
    defaultValue: 'allowed',
    toolbar: {
      icon: 'transfer',
      // Array of plain string values or MenuItem shape (see below)
      items: ['allowed', 'disabled'],
      // Property that specifies if the name of the item will be displayed
      showName: true,
      // Change title based on selected value
      dynamicTitle: true,
    },
  },
};

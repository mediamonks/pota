export default {
  presets: [
    [
      "@babel/preset-env",
      {
        // Allow importing core-js in entrypoint and use browserlist to select polyfills
        useBuiltIns: "usage",
        // Set the corejs version we are using to avoid warnings in console
        corejs: 3,
        targets: { esmodules: true },
      },
    ],
  ],
};

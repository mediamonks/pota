export default {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        bugfixes: true,
        corejs: 3, // Set the corejs version we are using to avoid warnings in console
      },
    ],
  ],
};

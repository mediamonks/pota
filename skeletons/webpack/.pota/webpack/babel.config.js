export default {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: 3, // Set the corejs version we are using to avoid warnings in console
      },
    ],
  ],
};

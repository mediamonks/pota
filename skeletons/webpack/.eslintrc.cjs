module.exports = {
  extends: ['@mediamonks/eslint-config-base'],
  parserOptions: {
    extraFileExtensions: ['.cjs'],
    project: './tsconfig.json',
  },
};

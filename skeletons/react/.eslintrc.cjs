module.exports = {
  extends: ['@mediamonks/eslint-config-react'],
  parserOptions: {
    extraFileExtensions: ['.cjs'],
    project: ['./tsconfig.json', './tsconfig.tools.json'],
  },
};

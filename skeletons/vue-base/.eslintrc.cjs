module.exports = {
  extends: ['@mediamonks/eslint-config-vue'],
  parserOptions: {
    extraFileExtensions: ['.cjs', '.vue'],
    project: './tsconfig.json',
  },
};

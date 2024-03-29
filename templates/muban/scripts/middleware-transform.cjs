module.exports = function (file, api) {
  const j = api.jscodeshift;
  const {statement} = j.template;

  // removes the twig middleware in the storybook middleware file
  return j(file.source)
    .find(j.IfStatement, { test: { name: 'ENABLE_TEMPLATE_MIDDLEWARE'}})
    .replaceWith(() => {
      return statement``;

    })
    .toSource();
};

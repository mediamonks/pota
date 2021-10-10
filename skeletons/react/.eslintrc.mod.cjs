module.exports = function(info, api) {
  const j = api.jscodeshift;

  const noExtraneousDependenciesProperty = j.property(
    'init',
    j.stringLiteral('import/no-extraneous-dependencies'),
    j.arrayExpression([
      j.stringLiteral('error'),
      j.objectExpression([
        j.property(
          'init',
          j.stringLiteral('packageDir'),
          j.stringLiteral('node_modules/@pota/porter-react-skeleton'),
        ),
      ]),
    ]),
  );

  return j(info.source)
    // find 'rules' property
    .find(j.Property, (property) => property.key.name === "rules")
    // find first property
    .find(j.Property)
    .insertAfter(noExtraneousDependenciesProperty)
    .toSource({ qoute: 'single' });
}


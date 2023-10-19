//$ npx jscodeshift -t object-assign\transform.js object-assign\test-after.js
module.exports = function(fileInfo, { jscodeshift }, options) {
  const j = jscodeshift;
  const root = jscodeshift(fileInfo.source);

  const rmObjectAssignCall = path => {
    const properties = path.value.arguments.reduce(
      (allProperties, {  ...argument }) => {
        if (argument.type === "ObjectExpression") {
          const { properties } = argument;
          return [...allProperties, ...properties];
        }

        return [...allProperties, { ...j.spreadProperty(argument) }];
      },
      []
    );
    return j(path).replaceWith(j.objectExpression(properties));
  };

  root
    .find(j.CallExpression, {
      callee: { object: { name: "Object" }, property: { name: "assign" } },
      arguments: [{ type: "ObjectExpression" }]
    })
    .forEach(rmObjectAssignCall);

  return root.toSource();
};

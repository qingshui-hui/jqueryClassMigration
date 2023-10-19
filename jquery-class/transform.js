// $ npx jscodeshift -t jquery-class\transform.js jquery-class\test.js -d -p
/**
 * 
 * @param {*} fileInfo 
 * @param {{jscodeshift: import("jscodeshift").JSCodeshift}} param1 
 * @param {*} options 
 * @returns 
 */
module.exports = function(fileInfo, { jscodeshift }, options) {
  const j = jscodeshift;
  const root = jscodeshift(fileInfo.source);

  root.find(j.CallExpression).filter((path) => {
    const ok = path.scope.isGlobal
      && path.value.arguments.length === 3
      && path.value.arguments[0].type === 'Literal'
      && path.value.arguments[1].type === 'ObjectExpression'
      && path.value.arguments[2].type === 'ObjectExpression'
    return ok
  }).replaceWith(path => {
    /** @type {import("jscodeshift").ObjectExpression} */
    const staticProperties = path.value.arguments[1]
    /** @type {import("jscodeshift").ObjectExpression} */
    const instanceProperties = path.value.arguments[2]
    return j.classExpression(
      j.identifier(path.value.arguments[0].value),
      j.classBody([
        ...staticProperties.properties.map(p => {
          return j.classProperty(p.key, p.value, null, true)
        }),
        ...instanceProperties.properties.map(p => {
          return j.classProperty(p.key, p.value, null, false)
        }),
      ]),
      j.identifier(path.value.callee.property.name)
    )
  });
  return root.toSource();
};

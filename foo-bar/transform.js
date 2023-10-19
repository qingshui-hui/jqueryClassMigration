// $ npx jscodeshift -t foo-bar\transform.js foo-bar\test.js
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

  root
    .find(j.CallExpression, {
      callee: {
        object: { name: "foo" },
        property: { name: "bar" }
      }
    })
    .forEach(path => {
      j(path).replaceWith(
        j.callExpression(
          j.memberExpression(j.identifier("foo"), j.identifier("baz")),
          path.value.arguments
        )
      );
    });
  return root.toSource();
};

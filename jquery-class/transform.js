// $ npx jscodeshift -t jquery-class\transform.js jquery-class\test.js
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

  const data = [];
  root
    .find(j.CallExpression, {
      // callee: {
      //   object: { name: "foo" },
      //   property: { name: "bar" }
      // },
    })
    .filter((path) => {
      const ok = path.scope.isGlobal
        && path.value.arguments.length === 3
        && path.value.arguments[0].type === 'Literal'
        && path.value.arguments[1].type === 'ObjectExpression'
        && path.value.arguments[2].type === 'ObjectExpression'
      if (ok) {
        // console.log(path.value.arguments[0])
        // console.log(path.value.arguments[1])
        // console.log(path.value.arguments[2])
      }
      return ok
    })
    // .find(j.Property, {
    // })
    .forEach(path => {
      path.value.arguments[1].properties.forEach(property => {
        /** @type {import("jscodeshift").ASTNode} */
        const p = property
        // j(p).replaceWith(j.property(p.kind, p.key, p.value))
        // path.
        
        data.push({
          end_line: p.loc.end.line,
          end_column: p.loc.end.column,
          key: p.key.name,
        })
      })
      console.log(path.value.callee.property.name)
      console.log('path_start', path.value.loc.start)
      console.log('path_end', path.value.loc.end)
      return
      j(path).replaceWith(j.classExpression(
        j.identifier(path.value.arguments[0].value),
        j.classBody([
          j.classProperty(j.identifier('namea'), j.literal(0), null, true),
          // j.classPropertyDefinition(j.variableDeclarator('name: 0'))
        ]),
        // j.classImplements(j.identifier(path.value.arguments[0].value.value))
        j.literal(path.value.callee.property.name)
      ))
      // data.push({
      //   start: path.getValueProperty('start'), 
      //   end: path.getValueProperty('end'),
      //   parentStart: path.parent.value.start,
      // })
      // j(path).replaceWith(
      //   j.callExpression(
      //     j.memberExpression(j.identifier("foo"), j.identifier("baz")),
      //     path.value.arguments
      //   )
      // );
    });
  const objects = []
  const util = require('util')
  root
    .find(j.Node)
    .forEach(path => {
      // console.log(path.value.loc.start.toString())
      // console.log(path.value.type)
      objects.push({
        position: util.format(path.value.loc.start),
        type: path.value.type,
      })
    })
  // console.table(data)
  console.table(objects)
  return root.toSource();
};

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

  // root
  //   .find(j.Property, {
  //     // callee: {
  //     //   object: { name: "foo" },
  //     //   property: { name: "bar" }
  //     // },
  //   }).replaceWith(path => {
  //     // path.value.type = 'ClassProperty'
  //     return j.classProperty(path.value.key, path.value.value, null, true)
  //   })
  root.find(j.ObjectExpression)
    .replaceWith(path => {
      return j.classBody(path.value.properties.map(p => {
        // console.log(p)
        return j.classProperty(p.key, p.value, null, true)
      }))
    })
  const objects = []
  const util = require('util')
  // root
  //   .find(j.Node)
  //   .forEach(path => {
  //     // console.log(path.value.loc.start.toString())
  //     // console.log(path.value.type)
  //     objects.push({
  //       position: util.format(path.value.loc.start),
  //       type: path.value.type,
  //     })
  //   })
  // console.table(data)
  // console.table(objects)
  // console.log(root.toString())
  return root.toSource();
};

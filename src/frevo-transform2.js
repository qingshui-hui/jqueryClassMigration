// $ npx jscodeshift -t src/frevo-transform2.js testfixtures/VtigerList.input.js -d -p

/**
 * @param {import("jscodeshift").FileInfo} fileInfo 
 * @param {import("jscodeshift").API} api 
 * @param {import("jscodeshift").Options} options 
 * @returns 
 */
module.exports = function(fileInfo, api, options) {
  const j = api.jscodeshift;
  let root = j(fileInfo.source);

  root.find(j.ClassDeclaration).filter((path) => {
    return path.value.id.name.endsWith('_Js')
      && path.value.superClass
  }).forEach(path => {
    const node = path.value
    const className = path.value.id.name
    
    j(path).find(j.MethodDefinition, {
      key: { name: 'constructor' }
    }).forEach(methodPath => {
      j(methodPath).find(j.CallExpression, {
        callee: {
          object: { type: 'Super' },
          property: { name: 'constructor' },
        }
      }).replaceWith(methodPath => {
        if (options.dry) {
          console.log([
            className + '::constructor',
            `${fileInfo.path.replace('\\', '/')}:${methodPath.value.loc.start.line}`
          ].join(', '))
        }
        return j.callExpression(j.super(), methodPath.value.arguments)
      })

      const supercallExists = j(path).find(j.CallExpression, {
        callee: { type: 'Super' }
      }).length > 0
      if (supercallExists) return;

      const functionExpression = methodPath.value.value
      functionExpression.body.body.unshift(j.expressionStatement(
        j.callExpression(j.super(), functionExpression.params.map(param => {
          if (j.AssignmentPattern.check(param)) {
            // デフォルト値が代入されている場合
            return param.left
          }
          return param
        }))
      ))
      if (options.dry) {
        console.log([
          className + '::constructor',
          `${fileInfo.path.replace('\\', '/')}:${methodPath.value.loc.start.line}`
        ].join(', '))
      }
    })
  });

  return root.toSource({ lineTerminator: "\n" });
};

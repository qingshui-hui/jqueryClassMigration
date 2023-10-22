// $ npx jscodeshift -t src/frevo-transform.js testfixtures/VtigerClass.input.js -d -p

const { replaceJqueryClassDeclaration, removeOuterParentheses } = require('./utils')

/**
 * @param {import("jscodeshift").FileInfo} fileInfo 
 * @param {import("jscodeshift").API} api 
 * @param {import("jscodeshift").Options} options 
 * @returns 
 */
module.exports = function(fileInfo, api, options) {
  const j = api.jscodeshift;
  let root = j(fileInfo.source);
  let foundJqueryClass = false

  root.find(j.CallExpression).filter((path) => {
    if (!path.value.arguments) {
      return false
    }
    const ok = (
        path.value.arguments.length === 3
        && path.value.arguments[0].type === 'Literal'
        && path.value.arguments[1].type === 'ObjectExpression'
        && path.value.arguments[2].type === 'ObjectExpression'
      ) || (
        path.value.arguments.length === 2
        && path.value.arguments[0].type === 'Literal'
        && path.value.arguments[1].type === 'ObjectExpression'
      )
    return ok
  }).forEach(path => {
    foundJqueryClass = true

    const node = path.value
    const { className, baseClassName } = getNewClassInfo(j, path)
    if (!className.endsWith('_Js')) return true
    replaceJqueryClassDeclaration(j, path, className, baseClassName)
    if (options.dry) {
      console.log([
        className,
        baseClassName,
        `${fileInfo.path.replace('\\', '/')}:${node.loc.start.line}`
      ].join(', '))
    }
  });

  if (!foundJqueryClass) {
    return root.toSource({lineTerminator: "\n"})
  }

  let source = removeOuterParentheses({
    ...fileInfo,
    // タブのインデントが混ざっていると、文字数のカウントで不具合が起こるため 
    source: root.toSource({reuseWhitespace: false})
  }, api, options)
  return source.replace(/\r\n/g, "\n");
};

/**
 * @param {import("jscodeshift").JSCodeshift} j 
 * @param {import("jscodeshift").ASTPath<import("jscodeshift").CallExpression>} path 
 */
function getNewClassInfo(j, path) {
  /** @type {string|null} */
  let baseClassName = null
  const node = path.value
  if (j.MemberExpression.check(node.callee)
    && node.callee.property.name === 'extend') {
      baseClassName = node.callee.object.name
  } else if (node.callee.object) {
    // for VtigerCRM
    if (['$', 'jQuery'].includes(node.callee.object.name)
      && node.callee.property.name === 'Class') {
      baseClassName = null
    } else if (node.callee.object.name === 'Vtiger') {
      baseClassName = 'Vtiger_Class_Js'
    }
  }
  if (!baseClassName && node.callee.name) {
    baseClassName = node.callee.name
  }
  /** @type {string|null} */
  let className = node.arguments[0].value
  // for VtigerCRM
  if (className === 'Vtiger.Class') {
    className = 'Vtiger_Class_Js'
  }
  return {
    className,
    baseClassName
  }
}

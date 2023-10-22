// $ npx jscodeshift -t src/transform.js testfixtures/class-with-comments.input.js -d -p
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
    const ok = path.scope.isGlobal
      && path.value.arguments
      && path.value.arguments.length === 3
      && path.value.arguments[0].type === 'Literal'
      && path.value.arguments[1].type === 'ObjectExpression'
      && path.value.arguments[2].type === 'ObjectExpression'
    return ok
  }).replaceWith(path => {
    foundJqueryClass = true
    
    let baseClass = null
    const node = path.value
    if (j.MemberExpression.check(node.callee)
      && node.callee.property.name === 'extend') {
        baseClass = node.callee.object.name
    } else if (node.callee.object) {
      // for VtigerCRM
      if (['$', 'jQuery'].includes(node.callee.object.name)
        && node.callee.property.name === 'Class') {
        baseClass = null
      } else if (node.callee.object.name === 'Vtiger') {
        baseClass = 'Vtiger_Class'
      }
    }
    if (!baseClass && node.callee.name) {
      baseClass = node.callee.name
    }
    let className = node.arguments[0].value
    // for VtigerCRM
    if (className === 'Vtiger.Class') {
      className = 'Vtiger_Class'
    }
    /** @type {import("jscodeshift").ObjectExpression} */
    const staticProperties = node.arguments[1]
    /** @type {import("jscodeshift").ObjectExpression} */
    const instanceProperties = node.arguments[2]
    if (staticProperties.properties.length > 0) {
      addComments(staticProperties.properties[0], staticProperties.comments)
    }
    if (instanceProperties.properties.length > 0) {
      addComments(instanceProperties.properties[0], instanceProperties.comments)
    }
    const classExpression = j.classExpression(
      j.identifier(className),
      j.classBody([
        ...convertPropertiesForClass(staticProperties.properties, true),
        ...convertPropertiesForClass(instanceProperties.properties, false),
      ]),
      baseClass ? j.identifier(baseClass) : null
    )
    function convertPropertiesForClass(properties, isStatic) {
      return properties.map((p) => {
        let property
        if (!isStatic && p.key.name === 'init') {
          p.key.name = 'constructor'
        }
        if (j.FunctionExpression.check(p.value)) {
          property = j.classMethod("method", p.key, p.value.params, p.value.body, false, isStatic)
          findOldSuperMethodAndReplace(p.key.name, property)
        } else {
          property = j.classProperty(p.key, p.value, null, isStatic)
        }
        addComments(property, p.comments)
        return property
      })
    }
    /**
     * @param {string} methodName 
     * @param {import("jscodeshift").ClassMethod} classMethodAST 
     */
    function findOldSuperMethodAndReplace(methodName, classMethodAST) {
      if (!j.ClassMethod.check(classMethodAST)) {
        throw new TypeError(`${classMethodAST} is not ClassMethod type`)
      }
      j(classMethodAST).find(j.MemberExpression, {
        property: { name: '_super' }
      }).replaceWith(path => {
        const property = path.value.property
        property.name = methodName
        return j.memberExpression(j.super(), property)
      })
      j(classMethodAST).find(j.MemberExpression, {
        property: { name: 'Class' }
      }).replaceWith(path => {
        const property = path.value.property
        property.name = 'constructor'
        return j.memberExpression(j.thisExpression(), property)
      })
    }
    return classExpression
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
 * @param {import("jscodeshift").Node} node 
 * @param {array|null|undefined} comments 
 * @returns 
 */
function addComments(node, comments) {
  if (!node.comments) {
    node.comments = []
  }
  if (comments) {
    node.comments.push(...comments)
  }
}

/**
 * @param {import("jscodeshift").FileInfo} fileInfo 
 * @param {import("jscodeshift").API} api 
 * @param {import("jscodeshift").Options} options 
 * @returns 
 */
function removeOuterParentheses(fileInfo, api, options) {
  const j = api.jscodeshift;
  let root = j(fileInfo.source);

  const removeIndexList = []
  root.find(j.ClassExpression).forEach(path => {

    if (path.scope.isGlobal) {
      return true;
    }
    
    let text = fileInfo.source
    const beforeStartChar = text.slice(path.value.start - 1, path.value.start)
    const afterEndChar = text.slice(path.value.end, path.value.end + 1)
    if (beforeStartChar === '(' && afterEndChar === ')') {
      removeIndexList.push(path.value.start - 1)
      removeIndexList.push(path.value.end)
    } else {
      console.log('括弧で囲まれていませんでしたが、検知できなかった可能性もあります')
    }
  })
  let source = root.toSource();
  source = removeCharAt(source, removeIndexList);
  return source;
}

/**
 * @param {string} target 
 * @param {number[]} indices 
 */
function removeCharAt(target, indices) {
  if (indices.length === 0) {
    return target
  }
  let indexList = indices
  indexList.sort((a, b) => a - b).reverse()
  let text = target
  for (let index of indexList) {
    text = text.slice(0, index) + text.slice(index + 1)
  }
  return text
}

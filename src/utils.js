/**
 * @param {import("jscodeshift").JSCodeshift} j 
 * @param {*} properties 
 * @param {boolean} isStatic 
 * @returns 
 */
function convertPropertiesForClass(j, properties, isStatic) {
  return properties.map((p) => {
    let property
    if (!isStatic && p.key.name === 'init') {
      p.key.name = 'constructor'
    }
    if (j.FunctionExpression.check(p.value)) {
      property = j.classMethod("method", p.key, p.value.params, p.value.body, false, isStatic)
      replaceOldMethods(j, p.key.name, property)
    } else {
      property = j.classProperty(p.key, p.value, null, isStatic)
    }
    addComments(property, p.comments)
    return property
  })
}

/**
 * @param {import("jscodeshift").JSCodeshift} j 
 * @param {string} methodName 
 * @param {import("jscodeshift").ClassMethod} classMethodAST 
 */
function replaceOldMethods(j, methodName, classMethodAST) {
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

module.exports = {
  addComments,
  removeOuterParentheses,
  convertPropertiesForClass
}

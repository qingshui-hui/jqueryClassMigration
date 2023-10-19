// $ npx jscodeshift -t jquery-class\transform2.js jquery-class\test.js -d -p
/**
 * 
 * @param {import("jscodeshift").FileInfo} fileInfo 
 * @param {{jscodeshift: import("jscodeshift").JSCodeshift}} param1 
 * @param {import("jscodeshift").Options} options 
 * @returns 
 */
module.exports = function(fileInfo, { jscodeshift }, options) {
  const j = jscodeshift;
  const root = jscodeshift(fileInfo.source);

  const fs = require('fs');
  const removeIndexList = [];

  root.find(j.ClassExpression).forEach(path => {
    console.log(path.value.type, path.value.loc.start)
    console.log(path.value.type, path.value.loc.end)
    console.log(root)
    console.log(path)
    console.log(path.scope.isGlobal)

    if (path.scope.isGlobal) {
      return true;
    }

    // 文字コードを直接指定
    // let text = fs.readFileSync(fileInfo, 'utf-8');
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
  fs.writeFileSync(fileInfo.path, removeCharAt(fileInfo.source, removeIndexList))
  return root.toSource();
};

/**
 * @param {string} target 
 * @param {number[]} indices 
 */
function removeCharAt(target, indices) {
  if (indices.length === 0) {
    return target
  }
  let indexList = indices
  indexList.sort().reverse()
  let text = target
  for (let index of indexList) {
    text = text.slice(0, index) + text.slice(index + 1)
  }
  return text
}

const fs = require('fs')
const { applyTransform } = require('jscodeshift/dist/testUtils');

function expectTextEqual(actual, expected) {
  expect(actual).toEqual(expected.trim());
}

describe('transform.js', () => {
  it.each([
    ['class-with-comments'],
    ['class-extend'],
    ['VtigerClass'],
  ])("transform correctly %s", (fixture) => {
    const module = require('../src/transform')
    const expectedOutput = fs.readFileSync(`testfixtures/${fixture}.output.js`, 'utf8')
    const input = {
      path: `testfixtures/${fixture}.input.js`,
      source: fs.readFileSync(`testfixtures/${fixture}.input.js`, 'utf8')
    }
    const output = applyTransform(module, {}, input, {});
    console.log(output)
    expectTextEqual(output, expectedOutput)
  });
});

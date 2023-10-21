const fs = require('fs')
const { applyTransform } = require('jscodeshift/dist/testUtils');

function expectTextEqual(actual, expected) {
  expect(actual.replace(/\r\n/g, "\n")).toEqual(expected.trim().replace(/\r\n/g, "\n"));
}

describe('transform.js', () => {
  it(`transform correctly class-with-comments`, () => {
    const fixture = 'class-with-comments'

    const module = require('../src/transform')
    const expectedOutput = fs.readFileSync(`testfixtures/${fixture}.output.js`, 'utf8')
    const input = {
      path: `testfixtures/${fixture}.input.js`,
      source: fs.readFileSync(`testfixtures/${fixture}.input.js`, 'utf8')
    }
    const output = applyTransform(module, {}, input, {});
    expectTextEqual(output, expectedOutput)
  });

  it(`transform correctly class-extend`, () => {
    const fixture = 'class-extend'

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

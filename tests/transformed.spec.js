const fs = require('fs');
const { Monster } = require('../testfixtures/class-with-comments.output');
const { SeaMonster, Second } = require('../testfixtures/class-extend.output');

describe('transformed', () => {
  let fixture = ''
  it(`transformed correctly ${fixture}`, () => {
    const dragon = new Monster('dragon');
    expect(dragon.name).toEqual('dragon')
    expect(Monster.count).toEqual(1)
  });

  fixture = ''
  it(`transformed correctly ${fixture}`, () => {
    lockNess = new SeaMonster("Lock Ness");
    console.log(lockNess)
    lockNess.eat(4); //health = 12
    lockNess.fight(); //health = 11

    Second.staticMethod() // -> 2
  });
});

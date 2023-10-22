const { Monster } = require('../testfixtures/class-with-comments.output');
const { Second } = require('../testfixtures/class-extend.output');

describe('transformed', () => {
  it(`transformed correctly class-with-comments`, () => {
    const hydra = new Monster('hydra');
    const dragon = new Monster('dragon');
    expect(hydra.name).toEqual('hydra')
    expect(Monster.count).toEqual(2)
    
    hydra.eat(2)
    expect(hydra.health).toEqual(12)

    dragon.fight()
    expect(dragon.health).toEqual(8)
  });

  it(`transformed correctly class-extend`, () => {
    expect(Second.staticMethod()).toEqual(2)
  });
});

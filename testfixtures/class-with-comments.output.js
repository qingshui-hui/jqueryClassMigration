// comments
class Monster {
  /* @static */
  static count = 0;

  /* @prototype */
  constructor(name) {

    // saves name on the monster instance
    this.name = name;

    // sets the health
    this.health = 10;

    // increments count
    this.constructor.count++;
  }

  eat(smallChildren) {
    this.health += smallChildren;
  }

  fight() {
    this.health -= 2;
  }
};

// hydra = new Monster('hydra');

// dragon = new Monster('dragon');

// hydra.name        // -> hydra
// Monster.count     // -> 2
// Monster.shortName // -> 'Monster'

// hydra.eat(2);     // health = 12

// dragon.fight();   // health = 8

if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = {
    Monster
  }
}

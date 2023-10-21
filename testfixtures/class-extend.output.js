const { Monster } = require('./class-with-comments.output')

class SeaMonster extends Monster {
  static eat(smallChildren) {
    super.eat(smallChildren / 2);
  }

  static fight() {
    this.health -= 1;
  }
};

// lockNess = new SeaMonster("Lock Ness");
// lockNess.eat(4); //health = 12
// lockNess.fight(); //health = 11

class First {
  static staticMethod() { return 1;}
}

class Second extends First {
  static staticMethod() { return super.staticMethod()+1;}
}

// Second.staticMethod() // -> 2

module.exports = {
  SeaMonster,
  First,
  Second,
}

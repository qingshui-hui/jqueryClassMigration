// comments
class Monster {
  // static properties
  static count = 0;

  // constructor function
  // prototype properties
  constructor(name) {
    //save the name
    this.name = name;

    this.energy = 10;

    //increment the static count
    this.constructor.count++;
  }

  eat(smallChildren) {
    this.health += smallChildren;
  }

  fight() {
    this.health -= 2;
  }
}

module.exports = {
  Monster
}

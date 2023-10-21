const { Monster } = require('./class-with-comments.output')

Monster.extend("SeaMonster", {
  eat: function (smallChildren) {
    this._super(smallChildren / 2);
  },
  fight: function () {
    this.health -= 1;
  },
}, {});

// lockNess = new SeaMonster("Lock Ness");
// lockNess.eat(4); //health = 12
// lockNess.fight(); //health = 11

$.Class.extend("First",
{
   staticMethod: function() { return 1;}
},{})

First.extend("Second",{
   staticMethod: function() { return this._super()+1;}
},{})

// Second.staticMethod() // -> 2

module.exports = {
  SeaMonster,
  First,
  Second,
}

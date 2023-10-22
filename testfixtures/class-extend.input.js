$.Class.extend("First",
{
   staticMethod: function() { return 1;}
},{})

First.extend("Second",{
   staticMethod: function() { return this._super()+1;}
},{})

// Second.staticMethod() // -> 2

if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = {
    First,
    Second,
  }
}

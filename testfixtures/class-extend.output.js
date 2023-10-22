class First {
  static staticMethod() { return 1;}
}

class Second extends First {
  static staticMethod() { return super.staticMethod()+1;}
}

// Second.staticMethod() // -> 2

if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = {
    First,
    Second,
  }
}

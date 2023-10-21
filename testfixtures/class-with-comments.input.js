// comments
$.Class("Monster",
// static properties
{
  count: 0  
},
// prototype properties
{
  // constructor function
  init : function(name){
    //save the name
    this.name = name;

    this.energy = 10;

    //increment the static count
    this.Class.count++;
  },
  eat: function( smallChildren ){
    this.health += smallChildren;
  },
  fight: function() {
    this.health -= 2;
  }
})

module.exports = {
  Monster
}

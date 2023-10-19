
$.Class("Monster",
// static properties
{
  count: 0,
  name: 0,
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
    const a = {
      a: 1,
    }
  },
  create : function() {
    
  }
})

//create a monster
var dragon = new Monster('dragon');

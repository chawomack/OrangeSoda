var Ingredient = require('../models/ingredient');
var convertUnits = require('convert-units');

module.exports = function(ingredientId, order, callBack) {

  //gets current ingredient units
  Ingredient.findOne({_id: ingredientId}, function(err, ingredient){
    if(err)
      callBack(err, null);

    if (ingredient.units != order.units) {
      var qty =  convertUnits(order.quantity).from(order.units).to(ingredient.units);
      callBack(null, qty);
    } else {
      callBack(null, order.quantity);
    }
  });

};


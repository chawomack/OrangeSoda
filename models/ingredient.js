var mongoose = require('mongoose');

var Ingredient = new mongoose.Schema({
  name: { type: String, unique: true },
  quantity: Number,
  warning_quantity: Number,
  pending_quantity: Number,
  units: String
});


module.exports = mongoose.model('Ingredient', Ingredient);

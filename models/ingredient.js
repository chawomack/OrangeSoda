var mongoose = require('mongoose');
var Order = require('./order');

var Ingredient = new mongoose.Schema({
  name: { type: String, unique: true },
  quantity: Number,
  warning_quantity: Number,
  pending_quantity: Number,
  units: String,
  orders: [{ type : mongoose.Schema.ObjectId, ref : 'Order' }]
});


module.exports = mongoose.model('Ingredient', Ingredient);

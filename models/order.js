var mongoose = require('mongoose');
var User = require('./user');
var Ingredient = require('./ingredient');


var Order = new mongoose.Schema({
  ingredient: { type : mongoose.Schema.ObjectId, ref : 'Ingredient' },
  quantity: Number,
  units: String,
  ingredientTotalCost: Number,
  placedBy: { type : mongoose.Schema.ObjectId, ref : 'User' },
  date: Date,
  vendor: { type : mongoose.Schema.ObjectId, ref : 'Vendor' },
  shipping: {
    shipper: String,
    trackingNumber: String,
    fulfilled: {
      received: Boolean,
      receivedBy: { type : mongoose.Schema.ObjectId, ref : 'User' },
      date: Date
    }
  }

});

module.exports = mongoose.model('Order', Order);
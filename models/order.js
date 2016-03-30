var mongoose = require('mongoose');

var Order = new mongoose.Schema({
  ingredient: Schema.Types.Ingredient,
  quantity: Number,
  units: String,
  ingredientTotalCost: Number,
  placedBy: Schema.Types.User,
  date: Date(),
  shipping: {
    shipper: String,
    trackingNumber: String,
    fulfilled: {
      received: False,
      receivedBy: Schema.Types.User,
      date: Date()
    }
  }

});

module.exports = mongoose.model('Order', Order);
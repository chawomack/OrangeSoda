var mongoose = require('mongoose');
var User = require('./user');
var Ingredient = require('./ingredient');


var Batch = new mongoose.Schema({
  ingredient: { type : mongoose.Schema.ObjectId, ref : 'Ingredient' },
  quantity: Number,
  units: String,
  createdBy: { type : mongoose.Schema.ObjectId, ref : 'User' },
  date: Date,
  fulfilled: Boolean,
  fulfilledBy: { type : mongoose.Schema.ObjectId, ref : 'User' }
});

module.exports = mongoose.model('Batch', Batch);
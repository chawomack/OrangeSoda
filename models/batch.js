var mongoose = require('mongoose');
var User = require('./user');
var Ingredient = require('./ingredient');


var Batch = new mongoose.Schema({
  ingredient: { type : mongoose.Schema.ObjectId, ref : 'Ingredient' },
  quantity: Number,
  units: String,
  user: { type : mongoose.Schema.ObjectId, ref : 'User' },
  date: Date,
  fulfilled: Boolean
});

module.exports = mongoose.model('Batch', Batch);
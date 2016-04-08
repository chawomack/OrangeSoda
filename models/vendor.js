var mongoose = require('mongoose');
var Order = require('./order');

var Vendor = new mongoose.Schema({
  company: String,
  primaryContact: String,
  phone: String,
  email: String,
  primaryAddress: String,
  billingAddress: String,
  orders: [{ type : mongoose.Schema.ObjectId, ref : 'Order' }],
  notes: String
});

module.exports = mongoose.model('Vendor', Vendor);
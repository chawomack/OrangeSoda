var mongoose = require('mongoose');

var Vendor = new mongoose.Schema({
  company: String,
  primaryContact: String,
  phone: String,
  email: String,
  primaryAddress: String,
  billingAddress: String,
  orders: [],
  notes: String

});

module.exports = mongoose.model('Vendor', Vendor);
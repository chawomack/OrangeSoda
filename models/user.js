var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  password: String,
  role: String
});


User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);

var Ingredient = require('../models/ingredient');
var convertUnits = require('convert-units');
var User = require('../models/user');
var nodemailer = require('nodemailer');

var services = {};

services.updatePendingQuantity = function(ingredientId, qty, callback) {
    Ingredient.update({_id: ingredientId}, {$inc: {pending_quantity: qty}}, function (err, data) {
      if (err)
        callback(err, null);
      else
        callback(null, data);
    });
};

services.updateQuantity = function(ingredientId, qty, callback) {
    Ingredient.findOneAndUpdate({_id: ingredientId}, {$inc: {quantity: qty}}, function (err, data) {
      if (err)
        callback(err, null);
      else {
        console.log("Added Converted Units to Ingredient");
        services.checkWarning(ingredientId);
        callback(null, data);
      }
    });
};

services.unitConversion = function (ingredientId, order, callBack) {

    //gets current ingredient units
    Ingredient.findOne({_id: ingredientId}, function (err, ingredient) {
      if (err)
        callBack(err, null);

      if (ingredient.units != order.units) {
        console.log(order.quantity + " " + order.units + " " + ingredient.units);
        var qty = convertUnits(order.quantity).from(order.units).to(ingredient.units);
        callBack(null, qty);
      } else {
        console.log("Converted Units");
        callBack(null, order.quantity);
      }
    });

};

services.checkWarning = function (ingredientId) {
    Ingredient.findOne({_id: ingredientId}, function (err, ingredient) {
      if (err)
        callback(err, null);

      if (ingredient.warning_quantity >= ingredient.quantity) {
        console.log("Qty Below threshold");
        services.sendWarningEmail(ingredient)
      }
    })
};

services.sendWarningEmail = function (ingredient) {
    User.find({"role": 'admin'}).select('email').exec(function(err, data){
      if(err) return err;
      console.log(data);
      var emails =  data.map(function(user) {
        console.log(user.email);
        return user.email;
      });
      emails.join(', ');

      var mailOptions = {
        from: '@gmail.com', // sender address
        to: emails, // list of receivers
        subject: ingredient.name + ' is low in stock', // Subject line
        text: ingredient.name + ' is below at the warning threshold. Please order more product'
      };

      return services.transporter().sendMail(mailOptions, function (err, info) {
        if (err) {
          console.error(err);
          return err;
        } else {
          console.log('Email Sent');
          return
        }
      });
    });
};

services.transporter = function() {
  return nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: '@gmail.com', // Your email
      pass: '' // Your password
    }
  });
};

module.exports = services;




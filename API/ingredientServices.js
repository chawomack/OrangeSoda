var Ingredient = require('../models/ingredient');
var convertUnits = require('convert-units');
var User = require('../models/user');
var nodemailer = require('nodemailer');

module.exports = {

  updatePendingQuantity: function(ingredientId, qty, callback) {
    Ingredient.update({_id: ingredientId}, {$inc: {pending_quantity: qty}}, function (err, data) {
      if (err)
        callback(err, null);
      else
        callback(null, data);
    });
  },

  updateQuantity: function(ingredientId, qty, callback) {
    Ingredient.update({_id: ingredientId}, {$inc: {quantity: qty}}, function (err, data) {
      if (err)
        callback(err, null);
      else {
        console.log("Added Converted Units to Ingredient");
        callback(null, data);
      }
    });
  },

  unitConversion: function (ingredientId, order, callBack) {

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

  },

  checkWarning: function (ingredientId, callback) {
    Ingredient.findOne({_id: ingredientId}, function (err, ingredient) {
      if (err)
        callback(err, null);

      if (ingredient.warning_quantity == ingredient.quantity) {
        //TODO: Send email to admins
        services.sendWarningEmail()
      }
    })
  },

  sendWarningEmail: function () {
    User.find({role: 'admin'}, function (err, users) {
      return users;
    });
    var mailOptions = {
      from: '', // sender address
      to: sanitizedUser.email, // list of receivers
      subject: 'You forgot your password', // Subject line
      text: 'Your password is: password'
      // html: '<b>Hello world ✔</b>' // HTML body
    };
    transporter().sendMail(mailOptions, function (err, info) {
      if (err) {
        console.error(err);
        return res.flash('error', err.message)
      } else {
        console.log('Message sent: ' + info.response);
        return res.flash('sucess', 'Email Sent!')
      }
    })
  }
};


//function transporter() {
//  return nodemailer.createTransport({
//    service: 'Gmail',
//    auth: {
//      user: '', // Your email
//      pass: '' // Your password
//    }
//  });
//}
//
//function sendMail(transporter, mailOptions) {
//  transporter.sendMail(mailOptions, function (err, info) {
//    if (err) {
//      console.error(err);
//      return res.flash('error', err.message)
//    } else {
//      console.log('Message sent: ' + info.response);
//      return res.flash('sucess', 'Email Sent!')
//    }
//  })
//}


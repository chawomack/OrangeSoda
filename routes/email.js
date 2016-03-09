var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/user');
var nodemailer = require('nodemailer');

function transporter() {
  return nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: '', // Your email
      pass: '' // Your password
    }
  });
}

function sendMail(transporter, mailOptions) {
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.error(err);
      return res.flash('error', err.message)
    } else {
      console.log('Message sent: ' + info.response);
      return res.flash('sucess', 'Email Sent!')
    }
  })
}

router.get('/password/:username', function(req, res) {
  Account.findByUsername(req.params.username).then(function (sanitizedUser) {
    if (sanitizedUser) {
      console.log(sanitizedUser);
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
  });
});


module.exports = router;
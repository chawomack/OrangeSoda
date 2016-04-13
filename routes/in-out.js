var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

router.get('/', function(req, res, next) {
  res.render('in-out', { title: 'Incoming / Outgoing', user: req.user, messages: req.flash() });
});


module.exports = router;
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '6 Degrees', user: req.user, messages: req.flash() });
});

router.get('/crm', function(req, res, next) {
  res.render('crm', { title: '6 Degrees CRM', user: req.user });
});


router.get('/login', function(req, res, next){
  res.render('login', { title: 'login', user: req.user, messages: req.flash() });
});

router.post('/login', passport.authenticate('local', {failureFlash: true }), function(req, res) {
  //if (err) {
  //  console.log(err.message);
  //  return res.json({status: 'Error', messages: err.message});
  //}
  return res.status(200).json({messages: req.flash(), user: req.user, messages: "You were successfully logged in!" });
});


router.get('/logout',function(req, res, next){
  req.logout();
  req.flash("You were logged out");
  return res.status(200).json({status: 'Success', messages: 'You were successfully logged out.'});
});


module.exports = router;

var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

/* GET users view. */
router.get('/',function(req, res){
  if (req.user) {
    res.render('users', {title: 'CRM Users', messages: req.flash()});
  }
});

router.get('/isLoggedIn',function(req, res){
  console.log(req.user);
  if (req.user) {
    return res.status(200).json({status: 'Success', isLoggedIn: true, user: req.user})
  }
  else {
    return res.status(200).json({status: 'Success', isLoggedIn: false})
  }
});

/* GET list of users. */
router.get('/all', function(req, res, next){
  if (req.user) {
    if (req.user.role == 'admin') {
      User.find(function (err, user) {
        if (err) {
          return next(err)
        }
        res.status(200).json({status: 'Success', users: user});
      })
    }
    else if (req.user.role == 'manager') {
      User.find({"role":"fulfillment"}, function (err, user) {
        if (err) {
          return next(err)
        }
        res.status(200).json({status: 'Success', users: user});
      })
    }
  }
});

/* GET user by username. */
router.route('/edit/:username')
  .get(function(req, res){
    User.findByUsername(req.params.username).then(function (sanitizedUser) {
      return res.status(200).json({status: 'Success', user: sanitizedUser});
    });
  })
  .put(function(req, res){
    User.findByUsername(req.params.username).then(function (sanitizedUser) {
      if (sanitizedUser) {
        if (req.body.password) {
          sanitizedUser.setPassword(req.body.password, function () {
            sanitizedUser.save();
            delete req.body.password;
            req.flash('success', 'Password change successful!');
          });
        }
        for (var key in req.body) {
          sanitizedUser[key] = req.body[key];
        }
        sanitizedUser.save();
        return res.status(200).json({status: 'Success'});
      }
    });
  });

router.route('/addNew')
  .get(function(req, res) {
    if (req.user) {
      res.render('createUser', {title: 'Create New User', messages: req.flash() });
    }
  })
  .post(function(req, res) {
      if (req.user) {
        User.register(new User({username: req.body.username, name: req.body.name, email: req.body.email, role: req.body.role}),
          req.body.password, function (err, user) {
            if (err) {
              console.error(err);
              req.flash('error', err.message);
              res.json({status: 'Error', message: err.message});
            }

            passport.authenticate('local')(req, res, function () {
              console.error("authentication in progress...");
              req.flash('success', "User Successfully Created");
              res.status(200).json({status: 'Success', user: {username: user.username, name: user.name, role: user.role }})
            });
          });
      }
  });

router.route('delete/:username').delete(function(req, res){
  if (req.user) {
    User.remove({username: req.params.username}, function(err, user){
      if (err) {res.json({status: err.message})}
    })
  }
});


module.exports = router;

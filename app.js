var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var emailAPI = require('./routes/email');
var ingredients = require('./routes/ingredients');
var orders = require('./routes/orders');
var vendors = require('./routes/vendors');
var inOut = require('./routes/in-out');
var flash = require('connect-flash');

var app = express();

var logger = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressSession = require('express-session');
var User = require('./models/user');
var Ingredient = require('./models/ingredient');
var Order = require('./models/order');
var Vendor = require('./models/vendor');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(flash());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// scripts setup
app.use('/scripts', express.static(__dirname + '/node_modules/'));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


// routes
app.use('/', routes);
app.use('/users', users);
app.use('/ingredients', ingredients);
app.use('/email', emailAPI);
app.use('/orders', orders);
app.use('/vendor', vendors);
app.use('/inout', inOut);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/6DegreesCRM');


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


module.exports = app;

var express = require('express');
var router = express.Router();
var passport = require('passport');
var convertUnits = require('convert-units');
var Order = require('../models/order');
var Ingredient = require('../models/ingredient');
var Vendor = require('../models/vendor');
var unitConversion = require('../API/unitConversion');

router.get('/',function(req, res){
  if (req.user) {
    res.render('orders', {title: 'Orders', messages: req.flash()});
  }
});


router.route('/addNew')
  .get(function(req, res) {
    return res.status(200).json({status: 'Success'});
  })
  .post(function(req, res) {
    if (req.user) {
      // creates new order object
      req.body.placedBy = req.user._id;
      req.body.date = new Date();
      var order = new Order(req.body);

      //saves order
      order.save(function (err, data) {
        if (err) {
          return res.json({status: 'Error', messages: err.message})
        }
        //// adds order to ingredient document
        unitConversion(req.body.ingredient, order, function(err, qty){
          if (err)
            return res.json({status: 'Error', messages: err.message});

          Ingredient.update({_id: req.body.ingredient}, { $addToSet: {orders: order._id},
            $inc:{pending_quantity: qty} },  function(err, ingredient){
            if (err) {
              return res.json({status: 'Error', messages: err.message})
            }
          });

        });

        // adds order to vendor document
        Vendor.update({_id: req.body.vendor}, { $addToSet: {orders: order._id} }, function(err, data){
          if (err) {
            return res.json({status: 'Error', messages: err.message})
          }
        });

        return res.status(200).json({status: 'Success', order: data});
      });

    }
  });

router.get('/all',function(req, res){
  if (req.user) {
    Order.find(function (err, orders) {
      if (err) {
        return next(err)
      }
      res.status(200).json({status: 'Success', orders: orders});
    })
  }
});

router.get('/incoming',function(req, res){
  if (req.user) {
    Order.find({shipping: {fulfilled: {received: false }}}).populate('ingredient')
      .populate('vendor').exec(function (err, orders) {
      if (err) {
        return next(err)
      }
      res.status(200).json({status: 'Success', orders: orders});
    });
  }
});

router.route('/:id')
  .get(function(req, res){
    Order.find({_id: req.params.id}, function(err, order){
      if (err) {
        return next(err)
      }
        return res.status(200).json({status: 'Success', order: order});
    })
  });

router.post('/fulfilled', function(req, res){
  if (req.user) {
  Order.update({_id: req.body.id},{$set: {shipping: {fulfilled: {received: true }}}}, function (err, order) {
      if (err) {
        return res.json({status: 'Error', messages: err.message});
      }
      unitConversion(req.body.ingredient,req.body, function(err, qty){
        if (err)
          return res.json({status: 'Error', messages: err.message})

        Ingredient.update({_id: req.body.ingredient}, {$inc: {quantity: req.body.quantity, pending_quantity: -(qty)}},
          function(err, ingredient){
            if (err)
              return res.json({status: 'Error', messages: err.message})
          });
      });
      res.status(200).json({status: 'Success', order: order});
    });
  }
});

router.put('/update', function(req, res){
  if (req.user) {
    Order.update({_id: req.body.id}, {$set: req.body}, function (err, order) {
      if (err) {
        return res.json({status: 'Error', messages: err.message});
      }
      return res.status(200).json({status: 'Success', order: order});
    })
  }
});

router.delete('/delete', function(req, res){
  if (req.user) {
    Order.remove({_id: req.body.id}, function (err, order) {
      if (err) {
        return res.json({status: 'Error', messages: err.message});
      }
      return res.status(200).json({status: 'Success', order: order});
    })
  }
});

module.exports = router;


var express = require('express');
var router = express.Router();
var passport = require('passport');
var Order = require('../models/order');
var Ingredient = require('../models/ingredient');
var Vendor = require('../models/vendor');

/*
router.get('/',function(req, res){
  if (req.user) {
    res.render('orders', {title: 'Orders', messages: req.flash()});
  }
});
*/

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
        Ingredient.update({_id: req.body.ingredient}, { $addToSet: {orders: order._id},
          $inc:{pending_quantity: order.quantity} },  function(err, ingredient){
          if (err) {
            return res.json({status: 'Error', messages: err.message})
          }
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

module.exports = router;


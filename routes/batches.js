var express = require('express');
var router = express.Router();
var passport = require('passport');
var Batch = require('../models/batch');
var Ingredient = require('../models/ingredient');
var unitConversion = require('../API/unitConversion');

router.get('/',function(req, res){
  if (req.user) {
    res.render('batches', {title: 'Batch', messages: req.flash()});
  }
});


router.route('/addNew').post(function(req, res) {
  if (req.user) {
    var batch = new Batch(req.body);
    batch.save(function (err, data) {
      if (err) {
        return res.json({status: 'Error', messages: err.message})
      }
      unitConversion(req.body.ingredient, batch, function(err, qty){
        if (err) return err;

        Ingredient.update({_id: req.body.ingredient},  {$inc: {pending_quantity: -qty}}, function(err, data){
          if(err) return res.json({status: 'Error', messages: err.message})
        });
      });
      return res.status(200).json({status: 'Success', batch: data});
    });

  }
});

router.get('/all',function(req, res){
  if (req.user) {
    Batch.find(function (err, batch) {
      if (err) {
        return next(err)
      }
      res.status(200).json({status: 'Success', batch: batch});
    })
  }
});

router.put('/update',function(req, res){
  if (req.user) {
    console.log(req.body)
    Batch.update({_id: req.body.id}, {$set: req.body}, function (err, vendor) {
      if (err) {
        return res.json({status: 'Error', messages: err.message})
      }
      return res.status(200).json({status: 'Success', vendor: vendor});
    })
  }
});

router.delete('/delete', function(req, res){
  if (req.user) {
    Vendor.remove({_id: req.body.id}, function (err, vendor) {
      if (err) {
        return res.json({status: 'Error', messages: err.message});
      }
      return res.status(200).json({status: 'Success', vendor: vendor});
    })
  }
});

module.exports = router;
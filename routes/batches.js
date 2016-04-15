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
    req.body.createdBy = req.user;
    req.body.fulfilled = false;
    console.log(req.body);
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
    Batch.find({}).populate('ingredient').populate('createdBy').exec(function (err, batch) {
      if (err) {
        return next(err)
      }
      res.status(200).json({status: 'Success', batch: batch});
    })
  }
});

router.put('/update',function(req, res){
  if (req.user) {
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
    Batch.remove({_id: req.body.id}, function (err, batch) {
      if (err) {
        return res.json({status: 'Error', messages: err.message});
      }
      return res.status(200).json({status: 'Success', batch: batch});
    })
  }
});

router.get('/outgoing',function(req, res){
  if (req.user) {
    Batch.find({ fulfilled: false }).populate('ingredient').populate('createdBy').exec(function (err, batches) {
        if (err) {
          return next(err)
        }
        res.status(200).json({status: 'Success', batches: batches});
      });
  }
});

router.put('/fulfilled',function(req, res){
  if (req.user) {
    Batch.update({_id: req.body._id}, {$set: {fulfilled: true, fulfilledBy: req.user}}, function (err, batch) {
      if (err) {
        return res.json({status: 'Error', messages: err.message})
      }
      unitConversion(req.body.ingredient._id, batch, function(err, qty){
        if (err) return err;

        Ingredient.update({_id: req.body.ingredient._id},  {$inc: {quantity: -qty}}, function(err, data){
          if(err) return res.json({status: 'Error', messages: err.message})
        });
      });
      return res.status(200).json({status: 'Success', batch: batch});
    })
  }
});

module.exports = router;
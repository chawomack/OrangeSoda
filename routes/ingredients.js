var express = require('express');
var router = express.Router();
var Ingredient = require('../models/ingredient');

router.get('/', function(req, res){
    if (req.user) {
      res.render('ingredients', {title: 'Ingredients', messages: req.flash()});
    }
});

router.post('/addNew', function(req, res){
    if (req.user) {
      req.body.pending_quantity = req.body.quantity;
      var ingredient = new Ingredient(req.body);
      ingredient.save(function (err, data) {
          if (err) {
            return res.json({status: 'Error', messages: err.message})
          }
          return res.status(200).json({status: 'Success', ingredient: data});
      });
    }
});

router.get('/all', function(req, res){
  Ingredient.find(function(err, ingredients){
    if (err) {
      return res.json({status: 'Error', messages: err.message})
    }
    return res.status(200).json({status: 'Success', ingredients: ingredients});
  })
});

router.put('/update', function(req, res){
  if (req.user) {
    Ingredient.update({_id: req.body._id}, {$set: req.body}, function (err, ingredient) {
      if (err) {
        return res.json({status: 'Error', messages: err.message});
      }
      return res.status(200).json({status: 'Success', ingredient: ingredient});
    })
  }
});
router.delete('/delete/:id', function(req, res){
  if (req.user) {
    Ingredient.findByIdAndRemove(req.params.id, function (err, ingredient) {
      if (err) {
        return res.json({status: 'Error', messages: err.message});
      }
      return res.status(200).json({status: 'Success', ingredient: ingredient});
    })
  }
});

module.exports = router;
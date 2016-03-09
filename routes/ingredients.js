var express = require('express');
var router = express.Router();
var Ingredient = require('../models/ingredient');

router.route('/')
  .get(function(req, res){
    if (req.user) {
      res.render('ingredients', {title: 'Ingredients', messages: req.flash()});
    }
  })
  .post(function(req, res){
    //if (req.user) {
    var ingredient = new Ingredient(req.body);
    ingredient.save(function (err, data) {
        if (err) {
          return res.json({status: 'Error', messages: err.message})
        }
        return res.status(200).json({status: 'Success', ingredient: data});
      });
    //}
  });

//router.route('/:id').get(function(req, res, next){
//  Ingredient.findOne({_id: req.params.id}, function(err, data) {
//    if (err) {
//      next();
//      return res.json({status: 'Error', messages: err.message})
//    }
//    return res.status(200).json(data);
//  });
//});

router.route('/all').get(function(req, res){
  Ingredient.find(function(err, ingredients){
    if (err) {
      return res.json({status: 'Error', messages: err.message})
    }
    return res.status(200).json({status: 'Success', ingredients: ingredients});
  })
});

module.exports = router;
var express = require('express');
var router = express.Router();
var passport = require('passport');
var Vendor = require('../models/vendor');

router.get('/',function(req, res){
  if (req.user) {
    res.render('vendors', {title: 'Vendors', messages: req.flash()});
  }
});


router.route('/addNew').post(function(req, res) {
    if (req.user) {
      var vendor = new Vendor(req.body);
      vendor.save(function (err, data) {
        if (err) {
          return res.json({status: 'Error', messages: err.message})
        }
        return res.status(200).json({status: 'Success', vendor: data});
      });

    }
});

router.get('/all',function(req, res){
  if (req.user) {
    Vendor.find(function (err, vendors) {
      if (err) {
        return next(err)
      }
      res.status(200).json({status: 'Success', vendors: vendors});
    })
  }
});

module.exports = router;
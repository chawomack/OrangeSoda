var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/',function(req, res){
  if (req.user) {
    res.render('reports', {title: 'Reports', messages: req.flash()});
  }
});

module.exports = router;
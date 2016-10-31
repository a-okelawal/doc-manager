var express = require('express');
var router = express.Router();
var models = require('../models/index');
var Document = models.Document;

router.route('/documents').post(function(req, res) {
  Document.findOne({
    where: {
      title: req.body.title
    }
  }).then(function(document){
    if(!document) {
      Document.create({
        ownerId: req.body.ownerId,
        title: req.body.title,
        content: req.body.content
      }).then(function(){
        res.send({message: 'Document Created.'});
      });
    } else {
      res.send({message: 'Document title already exists.'});
    }
  });
}).delete(function(req, res) {
  Document.destroy({
    where: {
      title: req.body.title
    }
  }).then(function(){
    res.send({message: 'Document deleted.'});
  });
});

module.exports = router;

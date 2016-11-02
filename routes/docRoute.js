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
}).get(function(req, res) {
  Document.findAll({}).then(function(docs){
    res.send(docs);
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

router.route('/documents/:title').get(function(req, res) {
  Document.findOne({
    where: {
      title: req.params.title
    }
  }).then(function(document) {
    res.send(document);
  }).put(function(req, res) {
    Document.findOne({
      where: {
        title: req.params.title
      }
    }).then(function(document) {
      if(document) {
        // document.updateAttributes({
        //   title: req.body.title,
        //   content: req.body.content
        // }).success(function(document){
        //   res.send(document);
        // });
      } else {
        res.send({message: 'Document does not exist.'});
      }
    });
  }).delete(function(req, res) {
    Document.findOne({
      where: {
        title: req.params.title
      }
    }).then(function(document) {
      if(document) {
        Document.destroy({
          where: {
            title: req.params.title
          }
        }).then(function(){
          res.send({message: 'Document was deleted.'});
        });
      } else {
        res.send({message: 'Document does not exist.'});
      }
    });
  });
});

router.route('/users/:id/documents').get(function(req, res) {
  Document.findAll({
    where: {
      ownerId: req.params.id
    }
  }).then(function(document) {
    res.send(document);
  });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var models = require('../models/index');
var Document = models.Document;

router.route('/documents').post(function(req, res) {
  Document.create({
    ownerId: req.body.ownerId,
    title: req.body.title,
    content: req.body.content || '',
    private: req.body.private || false,
    role: req.body.role
  }).then(function(){
    res.send({message: 'Document Created.'});
  }).catch(function(err){
    res.send({message: 'Document title already exists.'});
  });
}).get(function(req, res) {
  const queries = {};

  if(req.session.userRole !== 1) {
    queries = {order:[
      ['createdAt', 'DESC']
    ]};
    const keys = Object.keys(req.query);
    if(keys.length <= 0) {
      queries['where'] = {
        $or: [
          {
            ownerId : {
              $eq: req.session.userId
            }
          },
          {
            private: {
              $eq: false
            }
          }
        ]
      };
    } else {
      keys.forEach((key) => {
        if(req.session.role === 1) {

        }
        if(key === 'role') {
          queries['where'] = {
            'role' : req.query[key]
          };
        } else if(key === 'ownerId') {
          queries['where'] = {
            'ownerId' : req.query[key]
          };
        } else if(key === 'date') {
          var result = new Date(req.query[key]);
          result.setDate(result.getDate() + 1);
          queries['where'] = {
            'createdAt': {
             $lt: result,
             $gt: new Date(new Date(req.query[key]))
            }
          };
        } else {
          queries[key] = req.query[key];
        }
      });
    }
  }
  Document.findAll(queries).then(function(docs){
    res.send(docs);
  });
}).delete(function(req, res) {
  Document.destroy({
    where: {
      title: req.body.title
    }
  }).then(function(){
    res.send({message: 'Document deleted.'});
  }).catch(function(err){
    res.status(400).send({message: 'Bad Request.'});
  });
});

router.route('/documents/:title').get(function(req, res) {
  Document.findOne({
    where: {
      title: req.params.title
    }
  }).then(function(document) {
    res.send(document);
  });
}).put(function(req, res) {
    Document.findOne({
      where: {
        title: req.params.title
      }
  }).then(function(data) {
    var document = data.dataValues;
    var body = req.body;
    data.update({
      ownerId: body.ownerId || document.ownerId,
      title: body.title || document.title,
      content: body.content || document.content,
      private: body.private || document.private,
      role: body.role || document.role
    }).then(function(document){
      res.send(document);
    }).catch(function(err) {
      res.status(404).send({message: 'Document does not exist.'});
    });
  });
}).delete(function(req, res) {
  Document.destroy({
    where: {
      title: req.params.title
    }
  }).then(function(){
    res.send({message: 'Document was deleted.'});
  }).catch(function(err){
    res.send({message: 'Document does not exist.'});
  });
});

router.route('/users/:id/documents').get(function(req, res) {
  Document.findAll({
    where: {
      $or: [
        {
          ownerId: {
            $eq: req.body.email
          }
        }, {
          private: {
            $eq: false
          }
        }
      ]
    }
  }).then(function(document) {
    res.send(document);
  });
});

module.exports = router;

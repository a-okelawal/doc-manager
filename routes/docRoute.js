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
  if(req.query.limit && req.query.offset){
    Document.findAll({
      order: [
        ['createdAt', 'DESC']
      ],
      limit: req.query.limit,
      offset: req.query.offset
    }).then(function(docs){
      res.send(docs);
    });
  } else if(req.query.limit && req.query.role) {
    Document.findAll({
      order: [
        ['createdAt', 'DESC']
      ],
      limit: req.query.limit,
      where: {
        role: req.query.role
      }
    }).then(function(docs){
      res.send(docs);
    });
  } else if(req.query.limit && req.query.date) {
    var result = new Date(req.query.date);
    result.setDate(result.getDate() + 1);
    Document.findAll({
      order: [
        ['createdAt', 'DESC']
      ],
      limit: req.query.limit,
      where: {
        createdAt: {
          $lt: result,
          $gt: new Date(new Date(req.query.date))
        }
      }
    }).then(function(docs){
      res.send(docs);
    });
  } else if(req.query.limit) {
    Document.findAll({
      order: [
        ['createdAt', 'DESC']
      ],
      limit: req.query.limit
    }).then(function(docs){
      res.send(docs);
    });
  } else if(req.query.ownerId) {
    Document.findAll({
      order: [
        ['createdAt', 'DESC']
      ],
      where : {
        ownerId: req.query.ownerId
      }
    }).then(function(docs){
      res.send(docs);
    });
  } else {
    Document.findAll({
      order: [
        ['createdAt', 'DESC']
      ],
      where : {
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
      }
    }).then(function(docs){
      res.send(docs);
    });
  }
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
    console.log(data);
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

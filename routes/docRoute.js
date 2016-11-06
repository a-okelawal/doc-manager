var express = require('express');
var router = express.Router();
var models = require('../models/index');
var Document = models.Document;

router.route('/documents').post(function(req, res) {
  if(!req.body.title) {
    res.send({message: 'Title of document is missing.'});
  }
  Document.findOne({
    where: {
      title: req.body.title
    }
  }).then(function(document){
    if(!document) {
      Document.create({
        ownerId: req.body.ownerId,
        title: req.body.title,
        content: req.body.content || '',
        private: req.body.private || 'public',
        role: req.body.role
      }).then(function(){
        res.send({message: 'Document Created.'});
      });
    } else {
      res.send({message: 'Document title already exists.'});
    }
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
      ]
    }).then(function(docs){
      res.send(docs);
    });
  }
}).delete(function(req, res) {
  if(!req.body.title) {
    res.send({message: 'Document name is needed to delete.'});
  }
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
        const body = req.body;
        document.updateAttributes({
          ownerId: body.ownerId || document.ownerId,
          title: body.title || document.title,
          content: body.content || document.content,
          private: body.private || document.private,
          role: body.role || document.role
        }).success(function(document){
          res.send(document);
        });
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

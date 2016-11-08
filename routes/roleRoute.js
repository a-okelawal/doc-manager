var express = require('express');
var router = express.Router();
var models = require('../models/index');
var Role = models.Role;

router.route('/roles').post(function(req, res){
  Role.findOne({
    where : {
      title: req.body.title
    }
  }).then(function(role){
    if(role) {
      res.send({message: 'Role already exists.'});
    } else {
      if(req.body.title) {
        Role.create({
          title: req.body.title
        }).then(function(err){
          if(err) {
            res.send(err);
          } else {
            res.send({message: 'Role was created.'});
          }
        });
      } else {
        res.send({message: 'Role title cannot be null'});
      }
    }
  });
}).get(function(req, res){
  Role.all(models, function(err, data){
    return res.send(data);
  });
}).delete(function(req, res){
  Role.destroy({
    where: {
      title: req.body.title
    }
  }).then(function(){
    res.send('Destroyed');
  });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var models = require('../models/index');
var User = models.User;

//Route for creting users
router.route('/users').post(function(req, res){
  var body = req.body;
  if(body.username && body.firstname && body.lastname && body.password && body.email && body.roleId) {
    User.findOne({
      where: {
        $or: [
          {
            email: {
              $eq: body.email
            }
          }, {
            username: {
              $eq: body.username
            }
          }
        ]
      }
    }).then(function(user){
      if(!user) {
        User.create({
          username: body.username,
          firstname: body.firstname,
          lastname: body.lastname,
          email: body.email,
          password: User.encrypt(body.password),
          RoleId: body.roleId
        }).then(function(user){
          //var token = jwt.sign(user.dataValues, config.secret, {expiresIn: 60*60*60*24});
          res.send({message: 'User created successfully.'});
        });
      } else {
        res.send({message: 'User already exists.'});
      }
    });
  } else {
    res.send({message: 'Singup details are incomplete, user not created successfully'});
  }
}).get(function(req, res){
  User.findAll({}).then(function(users){
    res.status(200).send(users);
  });
}).delete(function(req, res){
  User.destroy({
    where: {
      username: req.body.username
    }
  }).then(function(err){
    if(err) {
      res.send({message: 'An error occured.', error: err.message});
    } else {
      res.send({message: 'User deleted.'});
    }
  });
});

router.route('/users/:username').get(function(req, res){
  User.findOne({
    where: {
      username: req.params.username
    }
  }).then(function(user){
    res.send(user);
  });
});

module.exports = router;

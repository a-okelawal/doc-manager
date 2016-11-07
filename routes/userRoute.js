var express = require('express');
var router = express.Router();
var models = require('../models/index');
var User = models.User;
var jwt = require('jsonwebtoken');
var config = require('../config');

//Route for creting users
router.route('/users').post(function(req, res){
  var body = req.body;
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
  }).catch(function(err) {
    res.status(400).send({message: 'User email must be unique and contain last and first name.'});
  });
}).get(function(req, res){
  User.findAll({}).then(function(users){
    res.status(200).send(users);
  });
}).delete(function(req, res){
  User.destroy({
    where: {
      username: req.body.username
    }
  }).then(function(){
    res.send({message: 'User deleted.'});
  }).catch(function(err) {
    res.status(404).send({message: 'User not found.'});
  });
});

//Route for username parameter
router.route('/users/:username').get(function(req, res){
  User.findOne({
    where: {
      username: req.params.username
    }
  }).then(function(user){
    res.send(user);
  });
}).put(function(req, res){
  User.findOne({
    where: {
      username: req.params.username
    }
  }).then(function(data){
    var user = data.dataValues;
    var body = req.body;
    var password = body.password || user.password;
    data.update({
      username: body.username || user.username,
      firstname: body.firstname || user.firstname,
      lastname: body.lastname || user.lastname,
      email: body.email || user.email,
      password: User.encrypt(password),
      RoleId: body.roleId || user.roleId
    }).then(function(user){
      res.send(user);
    }).catch(function(err){
      res.status(404).send({message: 'No Such User Exists.'});
    });
  }).catch(function(err){
    res.status(400).send({message: 'Username or email is needed to find user.'});
  });
}).delete(function(req, res) {
  User.destroy({
    where: {
      username: req.params.username
    }
  }).then(function(){
    res.send({message: 'User was deleted.'});
  }).catch(function(err){
    res.status(400).send({message: 'User does not exist'});
  });
});

//login route
router.route('/users/login').post(function(req, res){
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(function(user){
    if(req.session.userId !== undefined) {
      res.send({message: 'A user is already logged in.'});
    } else if(user) {
      if(req.body.password === User.decrypt(user.password)) {
        var token = jwt.sign(user.dataValues, config.secret, {expiresIn: 60*60*60*24});

        req.session.userId = user.id;
        req.session.userRole = user.RoleId;
        req.session.token = token;

        res.send({message: 'You are logged in.'});
      } else {
        res.send({message: 'Wrong Password.'});
      }
    } else {
      res.send({message: 'User does not exist.'});
    }
  });
});

//logout route
router.route('/users/logout').post(function(req, res) {
  if(req.session.userId !== undefined) {
    req.session = undefined;
    res.send({message: 'User has been logged out.'});
  } else {
    res.send({message: 'There is no logged in user.'});
  }
});

module.exports = router;

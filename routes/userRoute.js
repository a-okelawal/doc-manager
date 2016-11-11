'use strict';

const express = require('express');
const router = express.Router();
const models = require('../models/index');
const User = models.User;

//Route for creting users
router.route('/users').post((req, res) => {
  User.register(req, res);
}).get((req, res) => {
  if(req.decoded.RoleId === 1) {
    User.all(res);
  } else {
    res.status(401).send({message: 'Access denied.'});
  }
}).delete((req, res) => {
  if(req.decoded.RoleId === 1 || req.body.username === req.decoded.username) {
    User.remove(req, res);
  } else {
    res.status(401).send({message: 'Access denied.'});
  }
});

//Route for username parameter
router.route('/users/:username').get((req, res) => {
  User.findUser(req, res);
}).put((req, res) => {
  if(req.decoded.RoleId === 1 || req.params.username === req.decoded.username) {
    User.updateUser(req, res);
  } else {
    res.status(401).send({message: 'Access denied.'});
  }
}).delete((req, res) => {
  if(req.decoded.RoleId === 1 || req.params.username === req.decoded.username) {
    User.remove(req, res);
  } else {
    res.status(401).send({message: 'Access denied.'});
  }
});

//login route
router.route('/users/login').post((req, res) => {
  User.login(req, res);
});

//logout route
router.route('/users/logout').post((req, res) => {
  User.logout(req, res);
});

module.exports = router;

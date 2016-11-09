'use strict';

const express = require('express');
const router = express.Router();
const models = require('../models/index');
const User = models.User;

//Route for creting users
router.route('/users').post((req, res) => {
  User.register(req, res);
}).get((req, res) => {
  User.all(res);
}).delete((req, res) => {
  User.remove(req.body, res);
});

//Route for username parameter
router.route('/users/:username').get((req, res) => {
  User.findUser(req, res);
}).put((req, res) => {
  User.updateUser(req, res);
}).delete((req, res) => {
  User.remove(req.params, res);
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

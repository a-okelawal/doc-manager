'use strict';

const express = require('express');
const router = express.Router();
const models = require('../models/index');
const Role = models.Role;

router.route('/roles').post((req, res) => {
  if(req.decoded.RoleId === 1) {
    Role.createRole(req, res);
  } else {
    res.status(401).send({message: 'Access denied.'});
  }
}).get((req, res) => {
  if(req.decoded.RoleId === 1) {
    Role.all(req, res);
  } else {
    res.status(401).send({message: 'Access denied.'});
  }
}).delete((req, res) => {
  Role.remove(req, res);
});

module.exports = router;

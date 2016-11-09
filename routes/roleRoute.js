'use strict';

const express = require('express');
const router = express.Router();
const models = require('../models/index');
const Role = models.Role;

router.route('/roles').post((req, res) => {
  Role.createRole(req, res);
}).get(function(req, res){
  Role.all(models, (err, data) => {
    return res.send(data);
  });
}).delete((req, res) => {
  Role.remove(req, res);
});

module.exports = router;

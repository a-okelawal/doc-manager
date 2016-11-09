'use strict';
const express = require('express');
let router = express.Router();
const models = require('../models/index');
let Document = models.Document;

router.route('/documents').post((req, res) => {
  Document.createDoc(req, res);
}).get((req, res) => {
  Document.get(req, res);
}).delete((req, res) => {
  Document.remove(req.body, res);
});

router.route('/documents/:title').get((req, res) => {
  Document.findDoc(req, res);
}).put((req, res) => {
  Document.updateDoc(req, res);
}).delete((req, res) => {
  Document.remove(req.params, res);
});

router.route('/users/:id/documents').get((req, res) => {
  Document.findOwnersDoc(req, res);
});

module.exports = router;

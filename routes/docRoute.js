import express from 'express';
import models from '../models';

const router = express.Router();
const Document = models.Document;

router.route('/').post((req, res) => {
  Document.createDoc(req, res);
}).get((req, res) => {
  Document.all(req, res);
}).delete((req, res) => {
  Document.remove(req.body, res);
});

router.route('/:title').get((req, res) => {
  Document.findDoc(req, res, models);
}).put((req, res) => {
  Document.updateDoc(req, res);
}).delete((req, res) => {
  Document.remove(req.params, res);
});

router.route('/users/:id').get((req, res) => {
  Document.findOwnersDoc(req, res);
});

export default router;

import express from 'express';
import models from '../models';

const router = express.Router();
const Role = models.Role;

router.route('/').post((req, res) => {
  Role.createRole(req, res);
}).get((req, res) => {
  Role.all(req, res);
}).delete((req, res) => {
  Role.remove(req, res);
});

export default router;

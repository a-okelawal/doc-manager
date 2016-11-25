import express from 'express';
import models from '../models';
import adminCheck from '../middleware/adminCheck';

const router = express.Router();
const Role = models.Role;

router.use(adminCheck);

router.route('/').post((req, res) => {
  Role.createRole(req, res);
}).get((req, res) => {
  Role.all(req, res);
}).delete((req, res) => {
  Role.remove(req, res);
});

export default router;

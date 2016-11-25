import express from 'express';
import models from '../models';
import adminRoleCheck from '../middleware/adminRoleCheck';

const router = express.Router();
const User = models.User;

// Route for creting users
router.route('/').post((req, res) => {
  User.register(req, res);
}).get(adminRoleCheck, (req, res) => {
  User.all(res);
}).delete(adminRoleCheck, (req, res) => {
  User.remove(req, res);
});

// Route for username parameter
router.route('/:username').get((req, res) => {
  User.findUser(req, res);
}).put(adminRoleCheck, (req, res) => {
  User.updateUser(req, res);
}).delete(adminRoleCheck, (req, res) => {
  User.remove(req, res);
});

// login route
router.route('/login').post((req, res) => {
  User.login(req, res);
});

// logout route
router.route('/logout').post((req, res) => {
  User.logout(req, res);
});

export default router;

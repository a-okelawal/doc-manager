import express from 'express';
import models from '../models';

const router = express.Router();
const User = models.User;

// Route for creting users
router.route('/').post((req, res) => {
  User.register(req, res);
}).get((req, res) => {
  if (req.decoded.RoleId === 1) {
    User.all(res);
  } else {
    res.status(403).send({ message: 'Access denied.' });
  }
}).delete((req, res) => {
  if (req.decoded.RoleId === 1 || req.body.username === req.decoded.username) {
    User.remove(req, res);
  } else {
    res.status(403).send({ message: 'Access denied.' });
  }
});

// Route for username parameter
router.route('/:username').get((req, res) => {
  User.findUser(req, res);
}).put((req, res) => {
  if (req.decoded.RoleId === 1 || req.params.username === req.decoded.username) {
    User.updateUser(req, res);
  } else {
    res.status(403).send({ message: 'Access denied.' });
  }
}).delete((req, res) => {
  if (req.decoded.RoleId === 1 || req.params.username === req.decoded.username) {
    User.remove(req, res);
  } else {
    res.status(403).send({ message: 'Access denied.' });
  }
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

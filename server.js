'use strict';

const express = require('express');
let app = express();
let router = express.Router();
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');
const config = require('./config');
const morgan = require('morgan');
const cookieSession = require('cookie-session');

//Body parser to get info from body or params
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

router.route('/test').get((req, res) => {
  res.status(200).send({message: 'Got it'});
});

//Port Configuration
let port = process.env.PORT || 3030;
app.set('superSecret', config.secret);

//Set cookie session
app.use(cookieSession({
  name: 'session',
  keys: ['userId, userRole', 'token']
}));

//test
app.use((req, res, next) => {
  res.on('render', () => {
    res.locals.route = req.route;
  });
  next();
});

//Set router authentication
app.use((req, res, next) => {
  if(req.path === '/api/users/login' || (req.path === '/api/users' && req.method === 'POST')) {
    next();
  } else {
    //Check body or params for token
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token) {
      //decode token
      jwt.verify(token, app.get('superSecret'),  (err, decoded) => {
        if(err) {
          return res.json({message: 'Failed to authenticate token.'});
        } else {
          //If all is good, save request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
    } else {
      //If there is no token, return error
      return res.status(403).send({message: 'No Token Provided.'});
    }
  }
});

//Add Routes
app.use('/api', require('./routes/userRoute'));
app.use('/api', require('./routes/roleRoute'));
app.use('/api', require('./routes/docRoute'));

console.log('Connected to port ' + port);
app.listen(port);
module.exports = app;

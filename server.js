var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');

var jwt = require('jsonwebtoken');
var config = require('./config');
var morgan = require('morgan');

//Body parser to get info from body or params
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

router.route('/test').get(function(req, res){
  res.status(200).send({message: 'Got it'});
});

//Port Configuration
var port = process.env.PORT || 3030;
app.set('superSecret', config.secret);

//Set router authentication
app.use(function(req, res, next) {
  //Check body or params for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if(token) {
    //decode token
    jwt.verify(token, app.get('superSecret'), function (err, decoded) {
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
});

//Add Routes
app.use('/api', require('./routes/userRoute'));
app.use('/api', require('./routes/roleRoute'));
app.use('/api', require('./routes/docRoute'));

console.log('Connected to port ' + port);
app.listen(port);
module.exports = app;

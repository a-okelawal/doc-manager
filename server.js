var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');

var jwt = require('jsonwebtoken');
var config = require('./config');
var models = require('./models/index');
var User = models.User;

//Body parser to get info from body or params
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Port Configuration
var port = process.env.PORT || 3030;
app.set('superSecret', config.secret);

//Route for creting users
router.route('/users').post(function(req, res){
  var body = req.body;
  if(body.username && body.firstname && body.lastname && body.password && body.email) {
    User.findOne({
      where: {
        $or: [
          {
            email: {
              $eq: body.email
            }
          }, {
            username: {
              $eq: body.username
            }
          }
        ]
      }
    }).then(function(user){
      if(!user) {
        User.create({
          username: body.username,
          firstname: body.firstname,
          lastname: body.lastname,
          email: body.email,
          password: User.encrypt(body.password)
        }).then(function(user){
          var token = jwt.sign(user.dataValues, app.get('superSecret'), {expiresIn: 60*60*24});
          res.send({message: 'User created successfully.', token: token});
        });
      } else {
        res.send({message: 'User already exists.'});
      }
    });
  } else {
    res.send({message: 'Singup details are incomplete, user not created successfully'});
  }
});

app.use('/api', router);
console.log('Connected to port ' + port);
app.listen(port);

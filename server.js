import bodyParser from 'body-parser';
import express from 'express';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import config from './config';
import userRoute from './routes/userRoute';
import roleRoute from './routes/roleRoute';
import docRoute from './routes/docRoute';

const app = express();

// Body parser to get info from body or params
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Port Configuration
const port = process.env.PORT || 3030;
app.set('superSecret', config.secret);

// Set router authentication
app.use((req, res, next) => {
  if (req.path === '/api/users/login' || (req.path === '/api/users' && req.method === 'POST')) {
    next();
  } else {
    // Check body or params for token
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      // decode token
      jwt.verify(token, app.get('superSecret'), (err, decoded) => {
        if (err) {
          return res.json({ message: 'Failed to authenticate token.' });
        }
        // If all is good, save request for use in other routes
        req.decoded = decoded;
        next();
      });
    } else {
      // If there is no token, return error
      return res.status(403).send({ message: 'No Token Provided.' });
    }
  }
});

// Add Routes
app.use('/api/users', userRoute);
app.use('/api/roles', roleRoute);
app.use('/api/documents', docRoute);

app.listen(port);
export default app;

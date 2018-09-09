 /**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const figlet = require('figlet');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */
const atmController = require('./controllers/atm');
const userController = require('./controllers/user');
const flowController = require('./controllers/flow');
const tokenController = require('./controllers/token');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});
mongoose.connection.on('connected', () => {
  console.log('MongoDB Connected. URI: ', process.env.MONGODB_URI);
});

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
  })
}));
app.enable('trust proxy');
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/jquery/dist'), { maxAge: 31557600000 }));
app.use('/webfonts', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'), { maxAge: 31557600000 }));

/**
 * Front End Routes.
 * This is the unique route we are using to fake the ATM.
 */
app.get('/', atmController.index);

/**
 * POST request from the Meraki Cloud.
 *
 * This endpoint will handle all the comunication with the Cisco Meraki
 * Scaning API. We continously look for the MAC Address of the *authenticated*
 * users and send a push notification to those near the AP.
 */
app.post('/', (req, res) => {
  req.body.data.observations.map(obs => {
    /**
     * This will usually be a database call.
     * Hackathon Scope, hackathon scope.
     * Sure boy, hackathon scope... !
     */
    if (obs.clientMac === '40:3f:8c:1e:27:05') {

      var sendNotification = function(data) {
        var headers = {
          "Content-Type": "application/json; charset=utf-8",
          "Authorization": "Basic YzVkYjZkZGYtNTVjOC00N2QzLWI2NWItZWE0MTAxNzA0YmE5"
        };
        
        var options = {
          host: "onesignal.com",
          port: 443,
          path: "/api/v1/notifications",
          method: "POST",
          headers: headers
        };
        
        var https = require('https');
        var req = https.request(options, function(res) {  
          res.on('data', function(data) {
            console.log("Response:");
            console.log(JSON.parse(data));
          });
        });
        
        req.on('error', function(e) {
          console.log("ERROR:");
          console.log(e);
        });
        
        req.write(JSON.stringify(data));
        req.end();
      };
      
      var payload = { 
            "title": 'Oscar ¡Tu retiro esta listo!',
            "message": 'Acercate y escanea el codigo QR en el cajero.',
            "url": 'bbvaflowapp://scanner/',
            "flow_id": '5b951dfdb1757c5b960852e3',
            "token": 'c73ceeef1700bb7fe6e712646976fd97',
          }
      var message = { 
        app_id: "850af6fc-6f49-4aa6-93db-485b39ea917d",
        contents: {
           "en" : JSON.stringify(payload)
        },
        included_segments: ["All"]
      };
  
      
      sendNotification(message);

    } else if(obs.clientMac === 'ac:5f:3e:3f:91:a5') {

      var sendNotification = function(data) {
        var headers = {
          "Content-Type": "application/json; charset=utf-8",
          "Authorization": "Basic YzVkYjZkZGYtNTVjOC00N2QzLWI2NWItZWE0MTAxNzA0YmE5"
        };
        
        var options = {
          host: "onesignal.com",
          port: 443,
          path: "/api/v1/notifications",
          method: "POST",
          headers: headers
        };
        
        var https = require('https');
        var req = https.request(options, function(res) {  
          res.on('data', function(data) {
            console.log("Response:");
            console.log(JSON.parse(data));
          });
        });
        
        req.on('error', function(e) {
          console.log("ERROR:");
          console.log(e);
        });
        
        req.write(JSON.stringify(data));
        req.end();
      };
      
      var payload = { 
        "title": 'Pedro ¡Tu retiro esta listo!',
        "message": 'Acercate y escanea el codigo QR en el cajero.',
        "url": 'bbvaflowapp://scanner/',
        "flow_id": '5b951dfdb1757c5b960852e3',
        "token": 'c73ceeef1700bb7fe6e712646976fd97',
      }
      var message = { 
        app_id: "850af6fc-6f49-4aa6-93db-485b39ea917d",
        contents: {
          "es" : JSON.stringify(payload)
        },
        included_segments: ["All"]
      };
      
      sendNotification(message);

    }
  });
  // Answer
  res.status(200).send('');
});

/**
 * Fake BBVA Bancomer Transactional API.
 *
 * This API will fake the transactional operations the bank
 * currently hasn't published on the API Marketplace.
 */

/**
 * User Routes.
 * Routes for handling the users.
 */

// Create a user. (Fake Signup for demo purposes)
app.post('/users/create', userController.createUser);
// Get a user.
app.get('/users/:id', userController.getUser);
// Get all the flows from a user.
app.get('/users/:id/flows', userController.getUserFlows);

/**
 * Flows.
 * These are all the programmed transactions on the BBVA Bancomer
 * mobile application.
 */
// Create a new flow.
app.post('/flows/create', flowController.createFlow);
 // Get a flow.
app.get('/flows/:id', flowController.getFlow);
// Delete a flow.
app.delete('/flows/:id/delete', flowController.deleteFlow);
// Execute a flow.
app.post('/flows/:id/run', flowController.runFlow);
// Get Flow if Token is used.
app.post('/flows/checkToken', flowController.checkToken);

/**
 * Tokens (QR Codes).
 * This endpoints allow us to generate new tokens for user
 * verification.
 */
// Create a new Token.
app.get('/tokens/create', tokenController.createToken);

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
} else {
  app.use(function(err, req, res, next) {
    console.error(err);
    res.status(500).send('Server Error');
  });
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
});

/**
 * Mandatory Figlet
 */
figlet('BBVA-Flow', (err, res) => {
  if (err) {
    console.log('Error: ', err);
  } else {
    console.log(res);
  }
});

module.exports = app;

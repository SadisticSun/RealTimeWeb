
/*jshint esversion: 6 */

// Dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const request = require('request');
const server = require('http').createServer(app);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up .env support
const dotenv = require('dotenv').config();

// Get .env variables
const api_key             = process.env.API_KEY;
const client_id           = process.env.CLIENT_ID;
const client_secret       = process.env.CLIENT_SECRET;
const response_type       = process.env.RESPONSE_TYPE;
const grant_type          = process.env.GRANT_TYPE;
const scope               = process.env.SCOPE;
const redirect_uri        = process.env.REDIRECT_URI;

const google_apis          = 'https://www.googleapis.com/';

// Authorization Code Request URL
var request_url =
'https://accounts.google.com/o/oauth2/auth?client_id='+ client_id + '&redirect_uri=' + redirect_uri + '&scope=' + scope + '&response_type=' + response_type + '&access_type=offline';

// ROUTES
/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', {
    title: 'OAUTH API test',
    request_url: request_url
  });
});

/* GET login page. */
app.get('/login', function(req, res) {
  var response_code = req.query.code;

  // Access Token POST request URL
  var post_url =
  google_apis + 'oauth2/v4/token?code='+ response_code + '&client_id='+ client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirect_uri + '&grant_type=' + grant_type;

  // Set empty variables
  var TOKEN;
  var REFRESH_TOKEN;
  var EXPIRATION_DATE;

  // Do POST request to Google API
  request.post(post_url, function (error, response, body) {
    // Parse response string into JSON
    parsed_data = JSON.parse(body);

    // Assign properties of the returned JSON to variables for later use
    TOKEN             = parsed_data.access_token;
    REFRESH_TOKEN     = parsed_data.refresh_token;
    EXPIRATION_DATE   = parsed_data.expires_in;

  });

  request(google_apis + 'youtube/v3/channels?access_token=' + TOKEN + '&part=snippet&mine=true', function(error, response, body) {
    if (error) {
      console.log(error);
    } else {
      console.log(body);
    }
  });
  res.render('login');
});

// Listen to port 3000
server.listen(3000);
console.log('[Server] Running on: http://localhost:3000');

module.exports = app;

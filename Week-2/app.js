/*jshint esversion: 6 */

// Dependencies
const express     = require('express');
const path        = require('path');
const bodyParser  = require('body-parser');
const app         = express();
const request     = require('request');
const server      = require('http').createServer(app);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// Set up .env support
const dotenv = require('dotenv').config();

// Get .env variables
const client_id       = process.env.CLIENT_ID;
const client_secret   = process.env.CLIENT_SECRET;
const response_type   = process.env.RESPONSE_TYPE;
const grant_type      = process.env.GRANT_TYPE;
const scope           = process.env.SCOPE;
const redirect_uri    = process.env.REDIRECT_URI;

// Set empty authorization variables
var ACCESS_TOKEN;
var REFRESH_TOKEN;
var EXPIRATION_DATE;

// Base Request URL
const base_URL = 'https://accounts.spotify.com/authorize/';

// Authorization Code Request URL
var request_url = base_URL + '?client_id=' + client_id + '&scope=' + scope + '&response_type=' + response_type + '&redirect_uri=' + redirect_uri;


// ROUTES
// -----------------------------------------------------------------------

/* GET home page. */
app.get('/', function(req, res) {
    res.render('index', {
        title: 'OAUTH API test',
        request_url: request_url
    });
});

/* GET login page. */
app.get('/login', function(req, res) {

    // Save the Authorization Code for later use
    var response_code = req.query.code;

    // Access Token POST request options
    let authOptions = {
          url: 'https://accounts.spotify.com/api/token',
          form: {
            code: response_code,
            redirect_uri: 'http://localhost:3000/login',
            grant_type: grant_type
          },
          headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
          },
          json: true
        };


    // Do POST request to API
    request.post(authOptions, function(error, response, body) {

      ACCESS_TOKEN = body.access_token;
      REFRESH_TOKEN = body.refresh_token;



      if (body.error) {
        res.render('error', {
          'error': body.error,
          'description': body.error_description
        });
      } else {
        let authOptions = {
          url: 'https://api.spotify.com/v1/me/top/artists',
          headers: {
            'Authorization': 'Bearer ' + ACCESS_TOKEN
          },
          json: true
        };

        request.get(authOptions, function(error, response, body) {
            console.log(body.items[0].external_urls);
            // getArtists(body.items[0].id);
            res.render('login', {
              artists: body.items
            });
        });
      }

  });
});

app.get('/success', function(res, req) {



});

// Listen to port 3000
server.listen(3000);
console.log('[Server] Running on: http://localhost:3000');

module.exports = app;

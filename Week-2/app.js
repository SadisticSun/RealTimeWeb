/*jshint esversion: 6 */

// Dependencies
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const compression = require('compression');
const request = require('request');
const Twitter = require('twitter');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// Set up .env support
const dotenv = require('dotenv').config();

// Get .env variables
// ------------------------------------------------------------------------
// Spotify Keys
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const response_type = process.env.RESPONSE_TYPE;
const grant_type = process.env.GRANT_TYPE;
const scope = process.env.SCOPE;
const redirect_uri = process.env.REDIRECT_URI;

// Twitter Keys
const twitter_cons_key = process.env.TWITTER_CONS_KEY;
const twitter_cons_secret = process.env.TWITTER_CONS_SECRET;
const twitter_access_token = process.env.TWITTER_ACCESS_TOKEN;
const twitter_token_secret = process.env.TWITTER_TOKEN_SECRET;

var T = new Twitter({
  consumer_key: twitter_cons_key,
  consumer_secret: twitter_cons_secret,
  access_token_key: twitter_access_token,
  access_token_secret: twitter_token_secret
});



// Set empty authorization variables
var ACCESS_TOKEN;
var REFRESH_TOKEN;
var EXPIRATION_DATE;

// Base Request URL
const base_URL = 'https://accounts.spotify.com/authorize/';

// Authorization Code Request URL
var request_url = base_URL + '?client_id=' + client_id + '&scope=' + scope + '&response_type=' + response_type + '&redirect_uri=' + redirect_uri;

// Socket IO
// ----------------------------------------------------------------------
var USERS = [];
var CONNECTIONS = [];

io.on('connection', function(socket) {
  CONNECTIONS.push(socket.id);
  console.log('[Server] New User Connected: %s user(s) connected', CONNECTIONS.length);

  // Emit to all clients the amount of online users
  io.sockets.emit('online-users', USERS);

  // Disconnect
  socket.on('disconnect', function() {
    USERS.splice(USERS.indexOf(socket), 1);
    CONNECTIONS.splice(CONNECTIONS.indexOf(socket), 1);
    console.log('[Server] Disconnected: %s user(s) still connected', CONNECTIONS.length);
    console.log(USERS);
    // Update the amount of online users to all clients
    io.sockets.emit('update-users', USERS);
  });
});

// ROUTES
// -----------------------------------------------------------------------

/* GET home page. */
app.get('/', function(req, res) {
    res.render('index', {
        title: 'Tweetify',
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
        USER_INFO = {};
        TOP_ARTISTS = {};
        NOW_PLAYING = {};


        var authOptionsForTopArtists = {
            url: 'https://api.spotify.com/v1/me/top/artists',
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            },
            json: true
        };

        var authOptionsForUserInformation = {
            url: 'https://api.spotify.com/v1/me/',
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            },
            json: true
          };

        var authOptionsForNowPlaying = {
            url: 'https://api.spotify.com/v1/me/player/currently-playing/',
            headers: {
              'Authorization': 'Bearer ' + ACCESS_TOKEN
            },
            json: true
        };

        function getDataFromAPI() {
          console.log('[Server] Getting information...');

          request.get(authOptionsForUserInformation, function(error, response, body) {
            USER_INFO = body;
            USERS.push(body.display_name);

          });

          request.get(authOptionsForTopArtists, function(error, response, body) {
            TOP_ARTISTS = body;
          });

          request.get(authOptionsForNowPlaying, function(error, response, body) {
            NOW_PLAYING = body;
          });
        }

        // If there's an error in the POST request, render ERROR page
        if (body.error) {
            res.render('error', {
                'error': body.error,
                'description': body.error_description
            });
        // When all goes well, get data from API
        } else {
          getDataFromAPI();

          setTimeout(function () {
            res.render('login', {
              user_info: USER_INFO,
              artists: TOP_ARTISTS,
              last_song: NOW_PLAYING
            });
          }, 2000);

        }
    });
});

app.get('/artist/:id', function(req, res) {

  var twitter_filter = req.params.id;
  console.log(twitter_filter);

  T.stream('statuses/filter', {
    track: twitter_filter
  }, function(stream) {
    stream.on('data', function(newTweet) {
      io.emit('new tweet', newTweet);
    });
    stream.on('error', function(err) {
      console.log(`Error: ${err}`);
    });
  });
  res.render('artist', { artist: twitter_filter });
});

// Listen to port 3000
server.listen(3000);
console.log('[Server] Running on: http://localhost:3000');

module.exports = app;

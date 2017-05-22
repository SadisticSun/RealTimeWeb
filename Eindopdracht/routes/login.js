const express = require('express')
const router = express.Router()

// Set empty authorization variables
var ACCESS_TOKEN;
var REFRESH_TOKEN;
var EXPIRATION_DATE;

// Base Request URL
const base_URL = 'https://accounts.spotify.com/authorize/';

// LOGIN ROUTE
// ==================================================

/* GET login page. */
router.get('/login', function(req, res) {
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

module.exports = router

const express = require('express');
const Router = express.Router();
const request                     = require('request');
const dotenv                      = require('dotenv').config();

// Spotify Keys
const client_id                   = process.env.CLIENT_ID;
const client_secret               = process.env.CLIENT_SECRET;
const response_type               = process.env.RESPONSE_TYPE;
const grant_type                  = process.env.GRANT_TYPE;
const scope                       = process.env.SCOPE;
const redirect_uri                = process.env.REDIRECT_URI;

// Base Request URL
const base_URL = 'https://accounts.spotify.com/authorize/';
var request_url = base_URL + '?client_id=' + client_id + '&scope=' + scope + '&response_type=' + response_type + '&redirect_uri=' + redirect_uri;

Router.get('/login', function(req, res) {
    console.log(request_url);
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

          var newUser;

          request.get(authOptionsForUserInformation, function(error, response, body) {
            USER_INFO = body;

            // new user hier aanmaken
          });

          request.get(authOptionsForTopArtists, function(error, response, body) {
            TOP_ARTISTS = body;

            // newUser update met artiesten info
          });

          request.get(authOptionsForNowPlaying, function(error, response, body) {
            var artist  = body.item.album.artists[0].name,
                song    = body.item.name;

            NOW_PLAYING = body;
            console.log('Body: ');
            console.log(body);
            // newUser update field nowPlayingArtist...

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

module.exports = Router;

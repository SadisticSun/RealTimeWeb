const express                     = require('express');
const Router                      = express.Router();
const request                     = require('request');
const dotenv                      = require('dotenv').config();

// Spotify Keys
const client_id                   = process.env.CLIENT_ID;
const client_secret               = process.env.CLIENT_SECRET;
const response_type               = process.env.RESPONSE_TYPE;
const grant_type                  = process.env.GRANT_TYPE;
const scope                       = process.env.SCOPE;
const redirect_uri                = process.env.REDIRECT_URI;

// import models
const User                        = require('../models/user.js');

// Base Request URL
const base_URL = 'https://accounts.spotify.com/authorize/';
var request_url = base_URL + '?client_id=' + client_id + '&scope=' + scope + '&response_type=' + response_type + '&redirect_uri=' + redirect_uri;

USER_INFO = {};
TOP_ARTISTS = {};
NOW_PLAYING = {};

const dbconfig = {
  checkForExistingUser: function (user) {
    // Check if user exists by looking for the user ID in database
    User.count({_id: user.id}, function (err, count){
      if (count>0) {
        console.log('[Server] User already exists in database');
      } else {
        User.create({
            _id: user.id,
            name: user.display_name
          }, function (err) {
            if (err) {
              console.log('[Server] ERROR: Cannot add user to database');
              console.log(err);
            } else {
              console.log('[Server] New User saved to database');
            }
        });
      }
    });
  },

  updateArtistData: function (data) {
  // Find the current user and update the top 20 artist in database
    User.findById(USER_INFO.id, function (err, user) {
      if (err) {
        console.log('[Server] ERROR: Could not find user by ID');
      } else {
        user.artists = data.items;
        user.save(function (err, user) {
          if (err) {
            console.log('[Server] ERROR: Could not update artist data');
          } else {
            console.log('[Server] Succesfully updated artist data');
          }
        })
      }
    })
  }
};

Router.get('/login', function(req, res) {

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
            dbconfig.checkForExistingUser(body);
          });

          // Get user's top 20 artists
          request.get(authOptionsForTopArtists, function(error, response, body) {
            TOP_ARTISTS = body;
            dbconfig.updateArtistData(body);

          });

          // Get user's recently played track
          request.get(authOptionsForNowPlaying, function(error, response, body) {
            var artist  = body.item.album.artists[0].name,
                song    = body.item.name;

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

module.exports = Router;

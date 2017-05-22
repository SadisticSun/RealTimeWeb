const express = require('express')
const router = express.Router()

// Set empty authorization variables
var ACCESS_TOKEN;
var REFRESH_TOKEN;
var EXPIRATION_DATE;

// Base Request URL
const base_URL = 'https://accounts.spotify.com/authorize/';

// Authorization Code Request URL
var request_url = base_URL + '?client_id=' + client_id + '&scope=' + scope + '&response_type=' + response_type + '&redirect_uri=' + redirect_uri;

// INDEX ROUTE
// ==================================================

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Tweetify',
        request_url: request_url
    });
});

module.exports = router

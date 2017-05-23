const express = require('express');
const Router = express.Router();
const Twitter = require('Twitter');
const dotenv  = require('dotenv').config();

// Twitter Keys
const twitter_cons_key            = process.env.TWITTER_CONS_KEY;
const twitter_cons_secret         = process.env.TWITTER_CONS_SECRET;
const twitter_access_token        = process.env.TWITTER_ACCESS_TOKEN;
const twitter_token_secret        = process.env.TWITTER_TOKEN_SECRET;

var T = new Twitter({
  consumer_key:                   twitter_cons_key,
  consumer_secret:                twitter_cons_secret,
  access_token_key:               twitter_access_token,
  access_token_secret:            twitter_token_secret
});

Router.get('/artist/:id', function(req, res, next) {
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
  res.render('../views/artist', { artist: twitter_filter });
});

module.exports = Router;

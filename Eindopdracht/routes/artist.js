const express = require('express');
const router = express.Router();
const Twitter = require('twitter');

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

// ARTIST TWEETS ROUTE
// ==================================================

router.get('/artist/:id', function(req, res) {

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

module.exports = router

const mongoose = require('mongoose');

var User = mongoose.model('spotifyUser', {
  _id:    String,
  name:   String,
  artists: [],
  nowPlayingArtist: {
    name: String,
    song: String
  }
});

module.exports = User;

const mongoose = require('mongoose');

var User = mongoose.model('spotifyUser', {
  _id:    String,
  name:   String,
  //artists: [{ id: String, name: String, href: String, imageRef: String }],
  nowPlayingArtist: { name: String, song: String }
});

module.exports = User;

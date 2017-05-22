(function() {
  'use strict';

  var socket = io();
  var tweetsContainer = document.getElementById('tweets');
  var tweets = [];

  socket.on('new tweet', function(data) {
    console.log('New tweet: ' + data);
    tweets.push(data.text);
    tweets.forEach(function(tweet) {
      var newItem = document.createElement("P");
      var textnode = document.createTextNode(data.text);
      newItem.appendChild(textnode);
      newItem.classList.add("tweet", "animated", "fadeInDown");
      tweetsContainer.insertBefore(newItem, tweetsContainer.childNodes[0]);
    });
    tweets = [];
  });

}());

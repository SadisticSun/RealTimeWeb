(function() {
  'use strict';

  var socket = io();
  var tweetsContainer = document.getElementById('tweets');

  socket.on('new tweet', function(data) {
    console.log('New tweet: ' + data.name);

    var tweets = [];

    tweets.push(data);

    tweets.forEach(function(tweet) {
      var newItem = document.createElement("P");
      var textnode = document.createTextNode(tweet.text);
      newItem.appendChild(textnode);
      newItem.classList.add("tweet", "animated", "fadeInDown");
      tweetsContainer.insertBefore(newItem, tweetsContainer.childNodes[0]);

      });
    });

}());

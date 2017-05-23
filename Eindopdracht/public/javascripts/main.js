(function() {
  'use strict';

  Offline.options = {checks: {xhr: {url: '/connection-test'}}};
  var socket = io();

  setInterval(function () {
      socket.emit('update song');
    }, 2000);
}());

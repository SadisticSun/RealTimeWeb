(function() {
  'use strict';

  var socket = io();
  var elements = {
    online_users: document.getElementById('online-users')
  };

  function updateUsers(users) {
    var html = '';
    elements.online_users.innerHTML = html;
    users.forEach(function(user) {
      console.log('Online: ' + user);
      html += '<li>' + user + '</li>';
      elements.online_users.innerHTML = html;
    });
  }

  socket.on('online-users', function (data) {
    console.log(data);
    console.log('Online users: ' + data.length);
    updateUsers(data);
  });

  socket.on('update-users', function (data) {
    console.log(data);
    console.log('Online users: ' + data.length);
    updateUsers(data);
  });

  setInterval(function(){
      socket.emit('update song');
    }, 2000);
}());

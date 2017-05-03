(function() {
  'use strict';

  var socket = io();
  var elements = {
    user_counter: document.getElementById('online-users')
  };

  socket.on('online-users', function (data) {
    console.log('Aantal online users: ' + data);
    elements.user_counter.innerHTML = data;
  });




  // var user_counter = 0;
  // var user_counter_element = document.getElementById('online-users');
  //
  // function incrementUserCounter() {
  //   user_counter++;
  //   user_counter_element.innerHTML = user_counter;
  // }
  //
  // function decreaseUserCounter() {
  //   user_counter--;
  //   user_counter_element.innerHTML = user_counter;
  // }

}());

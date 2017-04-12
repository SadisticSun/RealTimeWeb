
(function(){
var socket = io();

var $loginArea = document.getElementById('login-area');
var $loginForm = document.getElementById('login-form');
var $username = document.getElementById('username');
var $chatArea = document.getElementById('chat');
var $chatForm = document.getElementById('chat-form');
var $message = document.getElementById('message');
var $chat = document.getElementById('messages');

var user;

$loginForm.addEventListener('submit', function(event) {
  event.preventDefault();

  socket.emit('new user', $username.value, function(name) {
      socket.emit('setUsername', name);
  });

  socket.on('userSet', function(data){
    user = data.username;
    console.log(data.username + ' has logged in.');
    $loginArea.classList.add('hidden');
    $chatArea.classList.remove('hidden');
  });

  socket.on('userExists', function(data){
    document.getElementById('error-container').innerHTML = data;
  });

  $username.value = '';

});

$chatForm.addEventListener('submit', function(event) {
  event.preventDefault();
  socket.emit('send message', {message: $message.value, user: user});
  $message.value = '';
});

socket.on('new message', function(data) {
    console.log(data.user + ' says: ' + data.message);
    $chat.innerHTML += '<li><b>' + data.user + ':</b>' + ' ' + data.message;
    window.scrollTo(0, document.body.scrollHeight);
 });

return false;

})();

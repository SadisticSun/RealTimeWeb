
(function(){

// Socket Declaration
var socket = io();

// DOM elements
var $loginArea = document.getElementById('login-area');
var $loginForm = document.getElementById('login-form');
var $username = document.getElementById('username');
var $userList = document.getElementById('user-list');
var $chatArea = document.getElementById('chat');
var $chatForm = document.getElementById('chat-form');
var $message = document.getElementById('message');
var $chat = document.getElementById('messages');
var $chatSound = document.getElementById('audio');

// Set an empty user variable for later use
var user;

// Declare windowIsActive variable
var windowIsActive = false;

function playSound(){
  /*
      Play sound when window is inactive
      NOTE: Due to browser resource usage restrictions,
      sounds will not be played on the first time the browser is inactive
   */

    if (windowIsActive) {
    $chatSound.innerHTML = '<audio id="audio" src="/public/sounds/chat.mp3" autoplay></audio>';
  }
}

// Set windowIsActive to true when windows is in focus
window.onblur = function(){
    windowIsActive = true;
};
// Set windowIsActive to false when window is out of focus or minimized
window.onfocus = function(){
    windowIsActive = false;
};

// Login form handler
$loginForm.addEventListener('submit', function(event) {
  event.preventDefault();

// Send new user information to server
  socket.emit('new user', $username.value, function(name) {
      socket.emit('setUsername', name);
  });

// Show main window when username is available and succesfully sent to server
  socket.on('userSet', function(data){
    user = data.username;
    console.log(data.username + ' has logged in.');
    $loginArea.classList.add('hidden');
    $chatArea.classList.remove('hidden');
  });

// If the username exists, show error
  socket.on('userExists', function(data){
    document.getElementById('error-container').innerHTML = data;
  });

// Empty the input field
  $username.value = '';

});

// Chat message form handler
$chatForm.addEventListener('submit', function(event) {
  event.preventDefault();
  socket.emit('send message', {message: $message.value, user: user});
  $message.value = '';
});

// Update online user list
socket.on('update USERS', function(data) {
  var html = '';
  data.forEach(function(onlineUser){
    console.log('Online: ' + onlineUser);
    html += '<li class="user-list">' + onlineUser + '</li>';
    $userList.innerHTML = html;
  });
});

// New message handler
socket.on('new message', function(data) {
    console.log(data.user + ' says: ' + data.message);
    $chat.innerHTML += '<li><b>' + data.user + ':</b>' + ' ' + data.message;
    playSound();
    window.scrollTo(0, document.body.scrollHeight);
 });

})();

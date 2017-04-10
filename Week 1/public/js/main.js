
(function(){
var socket = io();
var form = document.getElementById('chat-form');
var message = document.getElementById('message');
var chat = document.getElementById('messages');


form.addEventListener('submit', function(event) {
  event.preventDefault();
  socket.emit('send message', message.value);
  message.value = '';
});

socket.on('new message', function(msg){
  var newItem = document.createElement('li');
  var itemContent = document.createTextNode(msg);
  newItem.append(itemContent);
  
  chat.append(newItem);
  window.scrollTo(0, document.body.scrollHeight);
  // console.log('New message: ' + msg);
 });

return false;

})();

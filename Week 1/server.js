
// TO DO:
// - Split server file into modules: routes, requirements, sockets

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var USERS = [];
var connections = [];

app.use('/public', express.static('./public'));

// Server setup
server.listen(3000);
console.log('[Server] Running on: http://localhost:3000');

// Routes
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});


// Socket.io
io.on('connection', function(socket) {
  connections.push(socket);

  // Username set
  socket.on('setUsername', function(name){
    if (USERS.indexOf(name) > -1 ) {
        console.log(USERS);
        socket.emit('userExists', name + ' is taken! Try another username.');
    } else {
      USERS.push(name);
      console.log(name);
      console.log(USERS);
      socket.emit('userSet', {username: name});
      io.sockets.emit('update USERS', USERS);
    }
  });

  console.log('[Server] Connected: %s user(s) connected', connections.length);

  // Disconnect
  socket.on('disconnect', function(){
    USERS.splice(USERS.indexOf(socket.username), 1);
    connections.splice(connections.indexOf(socket), 1);
    console.log('[Server] Disconnected: %s user(s) still connected', connections.length);
    console.log(USERS);
    io.sockets.emit('update USERS', USERS);
  });

  // Send message
  socket.on('send message', function(data) {
    io.sockets.emit('new message', data);
  });

  // New user
  socket.on('new user', function(data, callback) {
    callback(data);
    socket.username = data;
    console.log(USERS);
    io.sockets.emit('update USERS', USERS);
  });


});

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var users = [];
var connections = [];

app.use('/public', express.static('./public'));

// Server setup
server.listen(process.env.PORT || 3000);
console.log('[Server] Running on: http://localhost:3000');

// Routes
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// Socket.io
io.on('connection', function(socket){
  connections.push(socket);
  console.log('[Server] Connected: %s sockets connected', connections.length);

  // Disconnect
  socket.on('disconnect', function(){
    connections.splice(connections.indexOf(socket), 1);
    console.log('[Server] Disconnected: %s sockets still connected', connections.length);
  });

  // Send message
  socket.on('send message', function(msg) {
    io.sockets.emit('new message', msg);
  });

  
});

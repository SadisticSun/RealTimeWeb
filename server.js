// TO DO:
// - Split server file into modules: routes, requirements, sockets

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

var USERS = [];
var CONNECTIONS = [];

// Static files usage
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
    CONNECTIONS.push(socket);

    // Username set
    socket.on('setUsername', function(name) {
        if (USERS.indexOf(name) > -1) {
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

    console.log('[Server] Connected: %s user(s) connected', CONNECTIONS.length);

    // Disconnect
    socket.on('disconnect', function() {
        USERS.splice(USERS.indexOf(socket.username), 1);
        CONNECTIONS.splice(CONNECTIONS.indexOf(socket), 1);
        console.log('[Server] Disconnected: %s user(s) still connected', CONNECTIONS.length);
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

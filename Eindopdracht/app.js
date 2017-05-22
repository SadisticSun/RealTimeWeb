/*jshint esversion: 6 */

// Dependencies
const express                     = require('express');
const path                        = require('path');
const bodyParser                  = require('body-parser');
const app                         = express();
const compression                 = require('compression');
const request                     = require('request');
const server                      = require('http').createServer(app);
const io                          = require('socket.io').listen(server);
const dotenv                      = require('dotenv').config();

// Routes
const indexRoute                  = require('./routes/index.js');
const loginRoute                  = require('./routes/login.js');
const artistRoute                 = require('./routes/artist.js');

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));



// Spotify Keys
const client_id                   = process.env.CLIENT_ID;
const client_secret               = process.env.CLIENT_SECRET;
const response_type               = process.env.RESPONSE_TYPE;
const grant_type                  = process.env.GRANT_TYPE;
const scope                       = process.env.SCOPE;
const redirect_uri                = process.env.REDIRECT_URI;

app.use('/', indexRoute);
app.use('/login', loginRoute);
app.use('/artist', artistRoute);

// Socket IO
// ==================================================
var USERS = [];
var CONNECTIONS = [];

io.on('connection', function(socket) {
  CONNECTIONS.push(socket.id);
  console.log('[Server] New User Connected: %s user(s) connected', CONNECTIONS.length);

  // Emit to all clients the amount of online users
  io.sockets.emit('online-users', USERS);

  // Disconnect
  socket.on('disconnect', function() {
    USERS.splice(USERS.indexOf(socket), 1);
    CONNECTIONS.splice(CONNECTIONS.indexOf(socket), 1);

    console.log('[Server] Disconnected: %s user(s) still connected', CONNECTIONS.length);
    console.log(USERS);

    // Update the amount of online users to all clients
    io.sockets.emit('update-users', USERS);
  });
});

// Start Server
// ==================================================
server.listen(3000);
console.log('[Server] Running on: http://localhost:3000');

module.exports = app;

/*jshint esversion: 6 */

// Dependencies
const express                     = require('express');
const path                        = require('path');
const bodyParser                  = require('body-parser');
const app                         = express();
const compression                 = require('compression');
const server                      = require('http').createServer(app);
const io                          = require('socket.io').listen(server);
const mongoose                    = require('mongoose');
const dotenv                      = require('dotenv').config();

// import models
const User                        = require('./models/user.js');

// import routes
const artistsRouter               = require('./routes/artists.js');
const indexRouter                 = require('./routes/index.js');
const loginRouter                 = require('./routes/login.js');

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

console.log(process.env.REDIRECT_URI);


// Set empty authorization variables
var ACCESS_TOKEN;
var REFRESH_TOKEN;
var EXPIRATION_DATE;

// Set empty arrays for connections and users
var CONNECTIONS = [];
var USERS = [];

// Authorization Code Request URL

mongoose.connect('mongodb://localhost:8000');



// Routes
app.use('', indexRouter);
app.use('/', loginRouter);
app.use('/', artistsRouter);


// Socket IO
// ==================================================

io.on('connection', function(socket) {
  CONNECTIONS.push(socket.id);
  console.log('[Server] New User Connected: %s user(s) connected', CONNECTIONS.length);

  socket.on('update song', function() {

  })

  // Disconnect
  socket.on('disconnect', function() {
    CONNECTIONS.splice(CONNECTIONS.indexOf(socket), 1);
    console.log('[Server] Disconnected: %s user(s) still connected', CONNECTIONS.length);
  });
});


// Start Server
// ==================================================
server.listen(3000);
console.log('[Server] Running on: http://localhost:3000');

module.exports = app;

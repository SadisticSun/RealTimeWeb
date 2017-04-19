var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var index = require('./routes/index');
var server = require('http').createServer(app);

// listen to port 3000
server.listen(3000);
console.log('[Server] Running on: http://localhost:3000');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);


// error handler
app.use(function(err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

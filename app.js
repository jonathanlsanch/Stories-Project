var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var session = require('express-session');
var passport = require('passport');
var cors = require('cors');

// require('dotenv').config();
require('./configs/passport-config');

// var index = require('./routes/index');
// var storyApi = require('./routes/story-api');
// var userApi = require('./routes/user-api');

// database connection
require('./configs/database');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors());

// app.use('/', index);
// app.use('/api', storyApi);
// app.use('/api', userApi);

// This will be the default route is nothing else is caught
// app.use(function(req, res) {
//   res.sendfile(__dirname + '/public/index.html');
// });

// add session stuff
app.use(session({
  secret:"some secret goes here",
  resave: true,
  saveUninitialized: true
}));
// add passport stuff
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    credentials: true,                 // allow other domains to send cookies
    origin: ["http://localhost:4200"]  // these are the domains that are allowed
  })
);

// ============ routes ===================
var index = require("./routes/index");
app.use("/", index);

var authRoutes = require("./routes/authentication");
app.use("/", authRoutes);

var router = require("./routes/story-api");
app.use("/", router);

// =======================================


app.use((req, res, next) => {
  // If no routes match, send them the Angular HTML.
  res.sendFile(__dirname + "/public/index.html");
});

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;

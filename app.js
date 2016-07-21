var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport=require('passport');
var session=require('express-session');
var mongoose=require('mongoose');
var index=require('./routes/index');
var multer=require('multer');



// connetion to mongodb (activate if, if u have two connections)
//if(process.env.DEV_ENV){
mongoose.connect('mongodb://accountUser:password@localhost:27017/social-test');
//}
//else{
//mongoose.connect('mongodb://localhost:27017/social-test');

//}

var app = express();

var api = require('./routes/api');
var authenticate= require('./routes/authenticate')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({
secret:'this is secret',

 cookie: {
    maxAge: 1800000, //previously set to just 1800 - which was too low
    httpOnly: true
  }

}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());


require('./model/model.js');
var initPassport = require('./passport-init');
initPassport(passport);

app.use('/',index);
app.use('/api',api);
app.use('/auth', authenticate);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

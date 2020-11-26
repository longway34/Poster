var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var logger = require('morgan');
// var session = require('./session').sessionFunc;
// var passport = require('./passport');
// var LocalStrategy = require('passport-local').Strategy;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var loginRouter = require('./routes/login');
var leftoversRouter = require('./routes/leftovers');
var storagesRouter = require('./routes/storages');
var suppliersRouter = require('./routes/suppliers');
var settingsRouter = require('./routes/settings');
var shablonsRouter = require('./routes/shablons');
// var viberRouter = require('./routes/viber');
var myAdminRoute = require('./routes/phpmyadmin');
// const { use } = require('passport');
// global.PosterDB = require('./public/javascripts/DB');

var app = express();

// view engine setup
app.engine('pug', require('pug').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
// app.use('/viber', viberRouter);
// app.use('/phpMyAdmin', myAdminRoute);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// var bodyParser = require('body-parser');
// app.use(session);

// app.use(passport.initialize());
// app.use(passport.session());

app.use(flash())

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/phpmyadmin', myAdminRoute);
// app.use('/login', loginRouter);
app.use('/users', usersRouter);

app.use('/leftovers', leftoversRouter);
app.use('/storages', storagesRouter);
app.use('/suppliers', suppliersRouter);
app.use('/users', usersRouter);
app.use('/settings', settingsRouter);
app.use('/shablons', shablonsRouter);

// app.use('/viber', viberRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  // res.render('error');
});

module.exports = app;

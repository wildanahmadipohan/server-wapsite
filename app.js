var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

// mongoose connection
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://wildanahmadipohan:RN7U9js2zsitWDX@cluster0.podhl0t.mongodb.net/db_wapsite?retryWrites=true&w=majority');

var usersRouter = require('./routes/users');
var indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const oneDay = 1000 * 60 * 60 * 24;
app.use(methodOverride('_method'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: oneDay }
}))
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// asset of material-dashboard template
app.use('/material-dashboard', express.static(path.join(__dirname, 'public/material-dashboard')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/api/v1', apiRouter);

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
  res.render('error');
});

module.exports = app;
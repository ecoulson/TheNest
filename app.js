var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var layers = require('./DataAccessLayer/Layers');
const RBAC = require('easy-rbac');
const Roles = require('./AcessControl/');
let session = require('express-session');
let eSession = require('easy-session');

layers.connectToDatabase();
var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: '`QBM_7h8vzGvC@Q',
    resave: false,
    saveUninitialized: true
}));
app.use(eSession.main(session, Roles));
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api', indexRouter);

app.use(function(req, res, next) {
  console.log(`Not Found @${req.url}\n${createError(404)}`);
  res.status(404);
  res.send(`Not Found @${req.url}\n${createError(404)}`);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  if (err) {
	console.log(err);
  }
  res.status(err.status || 500)
});

module.exports = app;

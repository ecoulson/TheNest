require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Roles = require('./AcessControl/');
const session = require('express-session');
const eSession = require('easy-session');
const Layers = require('./DataAccessLayer/Layers');
const MongoDBStore = require('connect-mongodb-session')(session);
const fs = require('fs');
Layers.connectToDatabase();

var indexRouter = require('./routes/index');

let store = new MongoDBStore({
	uri: process.env.MONGO_CONNECTION_STRING,
	collection: 'sessions'
});

store.on('connected', function() {
	console.log('connected to session storage');
});

store.on('error', function(e) {
	if (err) {
		console.log(error);
		throw err;
	}
});

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	store: store,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24
	}
}));

app.use(eSession.main(session, Roles));
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.static(path.join(__dirname, 'client/public')));

app.use('/api', indexRouter);

app.use('/content/:file', function(request, response) {
	console.log("there!");
	response.sendFile(path.resolve(__dirname, 'client', 'public', request.params.file));
});

app.get('*', function (request, response){
	console.log("here!");
	response.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})

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

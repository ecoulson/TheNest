const path = require('path');
require('dotenv').config({
	path: path.join(__dirname, '..', '..', '.env')
});
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { AccessControl, Layers } = require('../../TheNest.Infrastructure');
const session = require('express-session');
const eSession = require('easy-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const IndexRouter = require('./routes/index');
const App = express();

let store = null;

Layers.Database.initializeDatabase().then(() => {
	store = new MongoDBStore({
		uri: process.env.MONGO_CONNECTION_STRING,
		collection: 'sessions'
	});
	store.on('connected', function() {
		console.log('connected to session storage');
	});
	store.on('error', function(err) {
		if (err) {
			throw err;
		}
	});
});

App.use(logger('dev'));
App.use(express.json());
App.use(express.urlencoded({ extended: false }));
App.use(cookieParser());

App.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	store: store,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24
	}
}));

App.use(eSession.main(session, AccessControl));
App.use(express.static(path.join(__dirname, '../../TheNest.Client/build')));
App.use(express.static(path.join(__dirname, '../../TheNest.Client/build')));


App.use('/api', IndexRouter);

App.get('*', function (request, response) {
	response.sendFile(path.resolve(__dirname, '../../TheNest.Client/build', 'index.html'))
})

App.use(function(req, res, next) {
	res.status(404);
	res.send(`Not Found @${req.url}\n${createError(404)}`);
});

App.use(function(err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	if (err) {
	console.log(err);
	}
	res.status(err.status || 500)
});

module.exports = App;

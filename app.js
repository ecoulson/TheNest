require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Roles = require('./AcessControl/');
const session = require('express-session');
const eSession = require('easy-session');
const MemcachedStore = require('connect-memjs')(session);
const Layers = require('./DataAccessLayer/Layers');
Layers.connectToDatabase();

var indexRouter = require('./routes/index');

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
	app.use(session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: new MemcachedStore({
			servers: [process.env.MEMCACHIER_SERVERS],
			prefix: '_session_'
		})
	}));
} else {
	app.use(session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false
	}));
}

app.use(eSession.main(session, Roles));
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api', indexRouter);

app.get('*', function (request, response){
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

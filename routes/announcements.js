var express = require('express');
var router = express.Router();
var moment = require('moment');

const announcements = [
	{
		id: 1,
		name: 'test',
		date: moment(),
		desc: 'Test description',
		author: 'test'
	}
]

router.get('/', function(req, res, next) {
	return res.json(announcements)
});

router.post('/', function(req, res, next) {
	console.log(req.body);
	announcements.push(req.body);
	res.send({
		success: true
	});
});

module.exports = router;

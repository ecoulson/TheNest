var express = require('express');
var router = express.Router();
var announcements = require('./announcements');
var feedback = require('./feedback');
var user = require('./user');

router.use('/announcements', announcements);
router.use('/user', user);
router.use('/feedback', feedback);

module.exports = router;

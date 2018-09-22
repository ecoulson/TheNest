var express = require('express');
var router = express.Router();
var announcements = require('./announcements');
var user = require('./user');

router.use('/announcements', announcements);
router.use('/user', user);

module.exports = router;

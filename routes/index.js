var express = require('express');
var router = express.Router();
var announcements = require('./announcements');
var user = require('./user');
var editor = require('./editor');

router.use('/announcements', announcements);
router.use('/user', user);
router.use('/editor', editor)

module.exports = router;

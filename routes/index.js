var express = require('express');
var router = express.Router();
var announcements = require('./announcements');

router.use('/announcements', announcements);

module.exports = router;

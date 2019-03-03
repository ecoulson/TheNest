var express = require('express');
var router = express.Router();
var AnnouncementRoute = require('./announcements');
var user = require('./user');
var editor = require('./editor');
let Layers = require('../DataAccessLayer/Layers');
const announcementLayer = Layers.announcementLayer;

let announcementRoute = new AnnouncementRoute(announcementLayer);
router.use('/announcements', announcementRoute.setup());
router.use('/user', user);
router.use('/editor', editor);

module.exports = router;

const express = require('express');
const AnnouncementRoute = require('./announcements');
const UserRoute = require('./user');
const EditorRoute = require('./editor');
const { Layers, CDN } = require('../../../TheNest.Infrastructure/');

const router = express.Router();

let announcementRoute = new AnnouncementRoute(Layers.Announcement);
let userRoute = new UserRoute(Layers.User);
let editorRoute = new EditorRoute(CDN);
router.use('/announcements', announcementRoute.setup());
router.use('/user', userRoute.setup());
router.use('/editor', editorRoute.setup());

module.exports = router;

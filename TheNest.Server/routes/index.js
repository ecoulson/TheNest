var express = require('express');
var router = express.Router();
var AnnouncementRoute = require('./announcements');
var UserRoute = require('./user');
var EditorRoute = require('./editor');
let Layers = require('../../TheNest.Infrastructure/DataAccessLayer/Layers');
let GithubCDN = require('./GithubCDN');

let announcementRoute = new AnnouncementRoute(Layers.announcementLayer);
let userRoute = new UserRoute(Layers.userLayer);
let editorRoute = new EditorRoute(GithubCDN);
router.use('/announcements', announcementRoute.setup());
router.use('/user', userRoute.setup());
router.use('/editor', editorRoute.setup());

module.exports = router;

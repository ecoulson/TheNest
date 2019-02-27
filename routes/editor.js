var express = require('express');
var router = express.Router();
var Form = require('multiparty').Form;
var multiparty = require('connect-multiparty');
var multipartMiddleware = multiparty();
var fs = require('fs');
var path = require('path');
var CDN = require('./GithubCDN');

router.post('/images', multipartMiddleware, async function(req, res, next) {
	req.session.can('Announcement:Create').then(async (hasAccess) => {
		if (hasAccess) {
			let url = await CDN.write(req.files.image.originalFilename, req.files.image.path);
			res.json({
				link: url
			}).status(200);
		} else {
			res.json({
				success: false,
			}).status(401)
		}
	});
});

module.exports = router;
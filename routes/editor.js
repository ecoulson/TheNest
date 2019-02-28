var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var multipartyConnect = require('connect-multiparty');
var multipartMiddleware = multipartyConnect();
var CDN = require('./GithubCDN');

router.post('/images', multipartMiddleware, async function(req, res, next) {
	req.session.can('Announcement:Create').then(async (hasAccess) => {
		if (hasAccess) {
			try {
				let url = await CDN.writeImage(req.files.image.originalFilename, req.files.image.path);
				res.json({
					link: url
				}).status(200);
			} catch (error) {
				res.json({
					success: false,
				}).status(500)
			}
		} else {
			res.json({
				success: false,
			}).status(401)
		}
	});
});

router.post('/files', async function(req, res, next) {
	req.session.can('Announcement:Create').then((hasAccess) => {
		if (hasAccess) {
			try {
				let form = new multiparty.Form();
				form.parse(req, async (err, fields, files) => {
					if (err) {
						res.json({
							success: false,
						}).status(500)
					}
					const path = files.file[0].path;
					const fileParts = files.file[0].originalFilename.split('.');
					const filename = fileParts[0] + new Date().getTime() + fileParts[1];
					let url = await CDN.writeFile(filename, path);
					res.json({
						link: url
					}).status(200);
				});
			} catch (error) {
				res.json({
					success: false,
				}).status(500)
			}
		} else {
			res.json({
				success: false,
			}).status(401)
		}
	});
});

module.exports = router;
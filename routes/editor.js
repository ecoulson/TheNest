var express = require('express');
var router = express.Router();
var Form = require('multiparty').Form;
var multiparty = require('connect-multiparty');
var multipartMiddleware = multiparty();
var fs = require('fs');
var path = require('path');

router.post('/images', multipartMiddleware, async function(req, res, next) {
	req.session.can('Announcement:Create').then(async (hasAccess) => {
		if (hasAccess) {
			const destinationPath = path.resolve(__dirname, '../client/public/content', req.files.image.originalFilename);
			const writeStream = fs.createWriteStream(destinationPath);
			fs.createReadStream(req.files.image.path)
				.pipe(writeStream);
			res.json({
				link: path.join('content', req.files.image.originalFilename);
			}).status(200);
		} else {
			res.json({
				success: false,
			}).status(401)
		}
	});
});

router.delete('/images', multipartMiddleware, async function(req, res, next) {
	req.session.can('Announcement:Create').then(async (hasAccess) => {
		if (hasAccess) {
			const destinationPath = path.resolve(__dirname, '../client/public/content', req.body.name);
			fs.unlink(destinationPath, (err) => {
				if (err) {
					res.json({
						success: false,
						error: err
					}).status(500)
				} else {
					res.json({
						success: true
					}).status(200);
				}
			});
		} else {
			res.json({
				success: false,
			}).status(401)
		}
	});
})

module.exports = router;
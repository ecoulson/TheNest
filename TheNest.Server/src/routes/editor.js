var Express = require('express');
var multiparty = require('multiparty');
var multipartyConnect = require('connect-multiparty');
var multipartMiddleware = multipartyConnect();

class EditorRoute {
	constructor(CDNManager) {
		this.CDNManager = CDNManager;
		this.saveFile = this.saveFile.bind(this);
		this.saveImage = this.saveImage.bind(this);
	}

	setup() {
		const router = Express.Router();
		router.post('/images', multipartMiddleware, this.saveImage);
		router.post('/files', this.saveFile);
		return router;
	}
	
	saveImage(req, res) {
		req.session.can('Announcement:Create').then(async (hasAccess) => {
			if (hasAccess) {
				this.handleAuthorizedImage(req, res);
			} else {
				res.json({
					success: false,
				}).status(401)
			}
		});
	}

	async handleAuthorizedImage(req, res) {
		try {
			let url = await this.CDNManager.writeImage(
				getCDNFileName(req.files.image.originalFilename), 
				req.files.image.path
			);
			res.json({
				link: url
			}).status(200);
		} catch (error) {
			sendUnsuccessfulResponse(res, 500);
		}
	}

	saveFile(req, res) {
		req.session.can('Announcement:Create').then((hasAccess) => {
			if (hasAccess) {
				this.handleAuthorizedFile(req, res)
			} else {
				sendUnsuccessfulResponse(res, 401);
			}
		});
	}

	async handleAuthorizedFile(req, res) {
		try {
			new multiparty.Form().parse(req, async (err, fields, files) => {
				if (err) {
					sendUnsuccessfulResponse(res, 500);
				}
				const path = files.file[0].path;
				let url = await this.CDNManager.writeFile(
					getCDNFileName(files.file[0].originalFilename), 
					path
				);
				res.json({
					link: url
				}).status(200);
			});
		} catch (error) {
			sendUnsuccessfulResponse(res, 500);
		}
	}
}

function getCDNFileName(originalFilename) {
	const parts = originalFilename.split('.');
	parts[0] += new Date().getTime();
	let fileName = parts[0] + "." + parts[1];
	return fileName.replace(/[^a-zA-Z0-9_\\-\\.]/g, "");
}

function sendUnsuccessfulResponse(res, status) {
	res.json({
		success: false,
	}).status(status)
}

module.exports = EditorRoute;
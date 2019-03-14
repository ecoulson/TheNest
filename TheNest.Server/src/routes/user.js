const Request = require('../http/Request');
const tokenUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
const Route = require('./route');
const Express = require('express');

class UserRoute extends Route {
	constructor(userLayer) {
		super();
		this.request = new Request();
		this.userLayer = userLayer;

		this.redirectLogin = this.redirectLogin.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handlePermissionCheck = this.handlePermissionCheck.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		this.getRole = this.getRole.bind(this);
	}

	setup() {
		const router = Express.Router();
		router.get('/login/', this.redirectLogin);
		router.get('/login/callback/:code', this.handleLogin);
		router.get('/can/:action', this.handlePermissionCheck);
		router.get('/logout', this.handleLogout);
		router.get('/', this.getRole);
		return router;
	}

	redirectLogin(req, res) {
		return res.json({
			location: process.env.MICROSOFT_LOGIN_URL
		}).status(302);
	}

	async handleLogin(req, res) {
		let token = await this.getAccessToken(req);
		let user = await this.getUserData(res, token.access_token);
		if (!user.userPrincipalName.endsWith("@overlake.org")) {
			return res.json({
				success: false,
			}).status(302);
		}
		user = await this.userLayer.getOrCreateUser(user);
		await this.setRole(req, user);
		return res.json({
			success: true,
			user: { id: user._id, username: user.displayName }
		}).status(302);
	}

	async getAccessToken(req) {
		return await this.request.makeRequest(tokenUrl,  {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: this.getToken(req.params.code)
		})
	}

	async getUserData(originalRes, access_token) {
		originalRes.cookie('userToken', access_token, { maxAge: 900000, httpOnly: true });
		return await this.request.makeRequest(`https://graph.microsoft.com/v1.0/me`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		});
	}
	
	async setRole(req, user) {
		await req.session.login(user.role.toLowerCase());
	}

	getToken(code) {
		let tokenBody = this.userLayer.getTokenBody(code);
		let string = [];
		for (let key in tokenBody) {
			string.push(`${encodeURIComponent(key)}=${encodeURIComponent(tokenBody[key])}`);
		}
		return string.join("&");
	}

	handlePermissionCheck(req, res) {
		return req.session.can(req.params.action).then((hasAccess) => {
			return res.json({
				success: true,
				can: hasAccess
			}).status(200);
		})
	}

	handleLogout(req, res) {
		return req.session.logout().then(() => {
			res.json({
				role: "guest",
				success: true
			});
		});
	}

	getRole(req, res) {
		res.json({
			role: req.session.getRole(),
			success: true
		}).status(200);
	}	
}

module.exports = UserRoute;
var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var Layers = require('../DataAccessLayer/Layers');
var userLayer = Layers.userLayer;
var keyVault = Layers.keyVault;

const tokenUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token";

router.get('/login/', function(req, res, next) {
	return res.json({
		location: userLayer.getLoginUrl()
	}).status(302);
});

router.get('/login/callback/:code', async function(req, res, next) {
	let token = await getAccessToken(req);
	console.log(token);
	let user = await getUserData(res, token);
	console.log(user);
	if (!user.email.endsWith("@overlake.org")) {
		return res.send({
			succes: false,
		}).status(302);
	}
	user = await userLayer.getOrCreateUser(user);
	await loginRole(req, user);
	console.log(user);
	res.send({
		success: true,
		user: { id: user._id, username: user.displayName }
	}).status(302);
});

async function getAccessToken(req) {
	return new Promise(async (resolve) => {
		fetch(tokenUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: await getToken(req.params.code)
		}).then((res) => {
			return res.json()
		}).then((json) => {
			return resolve(json.access_token);
		});
	})
}

async function getToken(code) {
	let tokenBody = await userLayer.getTokenBody(code, keyVault);
	let string = [];
	for (let key in tokenBody) {
		string.push(`${encodeURIComponent(key)}=${encodeURIComponent(tokenBody[key])}`);
	}
	return string.join("&");
}

async function getUserData(originalRes, access_token) {
	return new Promise((resolve) => {
		originalRes.cookie('userToken', access_token, { maxAge: 900000, httpOnly: true });
		fetch(`https://graph.microsoft.com/v1.0/me`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		}).then((res) => {
			return res.json();
		}).then((json) => {
			return resolve(json);
		});
	})
}

async function loginRole(req, user) {
	await req.session.login(user.role.toLowerCase());
}

router.get('/can/:action', function(req, res, next) {
	req.session.can(req.params.action).then((hasAccess) => {
		return res.json({
			success: true,
			can: hasAccess
		}).status(200);
	})
})

router.get('/logout', function (req, res, next) {
    req.session.logout().then(() => {
		res.json({
			role: "guest",
			succes: true
		});
	});
});

router.get('/', function (req, res, next){
    res.send({
		role: req.session.getRole(),
		succes: true
	}).status(200);
});

module.exports = router;
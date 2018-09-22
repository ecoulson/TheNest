const User = require('../models/user');

class UserLayer {
	async getOrCreateUser(userData) {
		return new Promise((resolve, reject) => {
			User.findOne({ microsoftID: userData.id }, async (error, user) => {
				if (error)
					return reject(error);
				if (!user) {
					let newUser = this.createUser(userData);
					await newUser.save(function (err) {
						if (err)
							return reject(error);
					});
					return resolve(this.createUser(userData));
				}
				return resolve(user);
			});
		})
	}

	createUser(userData) {
		return new User({
			displayName: userData.displayName,
			firstName: userData.givenName,
			lastName: userData.surname,
			role: "user",
			email: userData.mail,
			microsoftID: userData.id
		})
	}

	getLoginUrl() {
		return process.env.MICROSOFT_LOGIN_URL;
	}

	getTokenBody(code) {
		return {
			client_id: process.env.MICROSOFT_CLIENT_ID,
			client_secret: process.env.MICROSOFT_SECRET,
			code: code,
			redirect_uri: getRedirectUrl(),
			grant_type: "authorization_code"
		}
	}
}

function getRedirectUrl() {
	if (process.env.NODE_ENV == 'production') {
		return process.env.REDIRECT_URL;
	} else {
		return "http://localhost:3000/login"
	}
}

module.exports = UserLayer;
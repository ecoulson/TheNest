const User = require('../models/user');

class UserLayer {
	constructor(userModel) {
		this.userModel = userModel;
	}

	async getOrCreateUser(userData) {
		return new Promise((resolve, reject) => {
			this.userModel.findOne({ microsoftID: userData.id }, async (error, user) => {
				if (error)
					return reject(error);
				if (!user) {
					let newUser = createUser(userData);
					await newUser.save(function (err) {
						if (err)
							return reject(error);
					});
					return resolve(newUser);
				}
				return resolve(user);
			});
		})
	}

	getTokenBody(code) {
		return {
			client_id: process.env.MICROSOFT_CLIENT_ID,
			client_secret: process.env.MICROSOFT_SECRET,
			code: code,
			redirect_uri: process.env.REDIRECT_URL,
			grant_type: "authorization_code"
		}
	}
}

function createUser(userData) {
	return new User({
		displayName: userData.displayName,
		firstName: userData.givenName,
		lastName: userData.surname,
		role: "user",
		email: userData.mail,
		microsoftID: userData.id
	})
}

module.exports = UserLayer;
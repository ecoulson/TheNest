const AppClientIdKey = "AppClientId";
const AppClientIdVersion = "ba35c40241a9494e918e638f8d5ff3f8";

const AppClientSecretKey = "AppClientSecret";
const AppClientSecretVersion = "62f3e8ddd24c4af0a97e562d5bf137f4";

const DataAccessLayer = require('./DataAccessLayer');
const UserFactory = require('./UserFactory');

class UserLayer extends DataAccessLayer {
	constructor(database) {
		super("Users", database, new UserFactory());
	}

	async getOrCreateUser(user) {
		let users = await this.selectAllEntries([
			{ key: "id", value: user.id, comparator: "EQ" }
		]);
		if (users.length == 0) {
			return this.createEntry(userToEntry(user), true);
		} else {
			return users[0];
		}
	}

	async getLoginUrl(keyVault) {
		return new Promise(async (resolve) => {
			let client = keyVault.getClient();
			let uri = keyVault.getVaultUri();
			let clientId = await client.getSecret(uri, AppClientIdKey, AppClientIdVersion);
			let loginUrl = `
			https://login.microsoftonline.com/common/oauth2/v2.0/authorize
			?client_id=${clientId.value}
			&redirect_uri=${encodeURI(getRedirectUrl())}
			&response_type=code
			&scope=User.ReadBasic.All`;
			return resolve(loginUrl);
		})
	}

	async getTokenBody(code, keyVault) {
		return new Promise(async (resolve) => {
			let client = keyVault.getClient();
			let uri = keyVault.getVaultUri();
			let clientId = await client.getSecret(uri, AppClientIdKey, AppClientIdVersion);
			let clientSecret = await client.getSecret(uri, AppClientSecretKey, AppClientSecretVersion);
			return resolve({
				client_id: clientId.value,
				client_secret: clientSecret.value,
				code: code,
				redirect_uri: getRedirectUrl(),
				grant_type: "authorization_code"
			});
		})
	}
}

function getRedirectUrl() {
	if (process.env.NODE_ENV == 'production') {
		return process.env.REDIRECT_URL;
	} else {
		return "http://localhost:3000/login"
	}
}

function userToEntry(data) {
	return {
		DisplayName: data.displayName,
		Id: data.id,
		FirstName: data.givenName,
		LastName: data.surname,
		Email: data.mail,
		UserRole: "user"
	}
}

module.exports = UserLayer;
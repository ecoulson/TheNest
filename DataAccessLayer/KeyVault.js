let AzureKeyVault = require('azure-keyvault');
let AuthenticationContext = require('adal-node').AuthenticationContext;
var vaultUri = "https://overlakeasbappkeyvault.vault.azure.net/";

let clientId = "74474db0-99b6-4ac7-b18a-46217b6e3647";
let clientKey = "5fnssiAT6A3nODuydjFKXvXWYSe4Oja0Y06PYVLsrsY=";

class KeyVault {
	getClient() {
		let credentials = new AzureKeyVault.KeyVaultCredentials(authenticator);
		return new AzureKeyVault.KeyVaultClient(credentials);
	}

	getVaultUri() {
		return vaultUri;
	}
}

function authenticator(challenge, callback) {
  let context = new AuthenticationContext(challenge.authorization);
  return context.acquireTokenWithClientCredentials(challenge.resource, clientId, clientKey, function (err, tokenResponse) {
    if (err) {
		throw err;
	}
    let authorizationValue = tokenResponse.tokenType + ' ' + tokenResponse.accessToken;
    return callback(null, authorizationValue);
  });
};

module.exports = KeyVault;
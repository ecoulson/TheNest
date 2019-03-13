const fetch = require('node-fetch');

class Request {
	async makeRequest(url, options) {
		let response = await fetch(url, options);
		return await response.json();
	}
}

module.exports = Request
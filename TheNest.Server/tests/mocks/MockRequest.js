class MockRequest {
	constructor() {
		this.responses = [];
	}

	queueResponse(response) {
		this.responses.push(response);
	}

	makeRequest(url, options) {
		if (this.responses.length == 0) {
			throw new Error("Error making request");
		} else {
			return this.responses.shift();
		}
	}
}

module.exports = MockRequest;
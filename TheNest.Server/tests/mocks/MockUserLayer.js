const Mock = require('./Mock');

class MockUserLayer extends Mock {

	getOrCreateUser(user) {
		return this.handleCall({
			...user,
			role: "guest",
			displayName: "foo",
			_id: 0
		});
	}

	getTokenBody(code) {
		return this.handleCall({
			client_id: "foo",
			client_secret: "bar",
			code: code,
			redirect_uri: "baz",
			grant_type: "qux"
		});
	}
}

module.exports = MockUserLayer
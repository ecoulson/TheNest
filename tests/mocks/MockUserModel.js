const Mock = require('../mocks/Mock');

class MockUserModel extends Mock {
	findOne(query, callback) {
		if (this.shouldThrow) {
			return callback(new Error("Error should be thrown for testing"));
		}
		if (!query.microsoftID) {
			callback(null, {})
		}
		if (query.microsoftID < 0) {
			callback(null, null);
		} else {
			callback(null, {
				id: query.microsoftID
			});
		}
	}
}

module.exports = MockUserModel;
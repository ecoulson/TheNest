const Mock = require('./Mock');

class MockCounterModel extends Mock {
	async findByIdAndUpdate() {
		return this.handleCall({
			value: 0
		});
	}
}

module.exports = MockCounterModel;